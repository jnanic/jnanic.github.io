---
title: "Building My Proxmox Homelab, Part 12: Private HTTPS for My Proxmox Dashboard"
description: "How I used Caddy and DNS validation to give Proxmox a private HTTPS name, then followed a browser request through to a working VM console."
publishedDate: "2026-11-29"
draft: true
tags:
- Homelab
- Proxmox
- Caddy
- HTTPS
- TLS
- DNS
- Let's Encrypt
---

<img src="/blog/caddy-order-part12.jpg" alt="Tim Robinson leans out a car window. Caddy asks for his order. He wants two DNS records, two certificates, two TLS connections, one WebSocket, and a way back in if he breaks Caddy." width="800" height="453">

I manage the lab’s VMs through [Proxmox VE](https://www.proxmox.com/en/products/proxmox-virtual-environment/overview). My firewall rules limit which devices can reach its login page. When I sign in from my Mac, HTTPS lets my browser verify the server’s identity and encrypts my password and session traffic as they cross the network.

Proxmox already served HTTPS with a certificate issued by its own cluster. I wanted to give it a private name and a certificate my usual browser could verify without installing the lab’s CA certificate on every device. I could then give other services their own names and keep their login pages inside the lab.

## Designing the route

[Caddy](https://github.com/caddyserver/caddy) fit what I needed from a reverse proxy. The standard build could load a certificate from disk, verify Proxmox’s certificate against the cluster CA, and proxy the WebSocket for the VM console. I could leave certificate renewal to a separate process.

I reviewed the Caddy design and ran isolated tests in the [Ubuntu development VM on my Mac](/blog/building-my-homelab-part11/). I set aside a separate [Debian](https://www.debian.org/) VM on Proxmox to run the proxy. I used the [DNS service built into my UniFi gateway](https://help.ui.com/hc/en-us/articles/15179064940439-UniFi-DNS-Records-and-Local-Hostnames) to point the private name at that VM. The gateway handled local DNS without a separate server. I can add a dedicated DNS server later if I need one. The VM is the staging proxy in [Part 10’s topology map](/blog/building-my-homelab-part10/).

I started with Proxmox. The browser would verify Caddy’s certificate, then Caddy would make its own HTTPS connection and verify Proxmox’s certificate against the lab’s certificate authority.

Caddy can read my admin session because it decrypts the request before forwarding it. I restricted who could reach the proxy and kept a direct route into Proxmox for recovery.

```mermaid size=compact caption="Caddy and Proxmox share a physical host. Traffic between the Services and Management VLANs still crosses the firewall."
flowchart TB
    accTitle: Two HTTPS connections from my Mac to Proxmox
    accDescr: The browser on my Mac connects over HTTPS through the firewall to Caddy in Services and verifies Caddy’s certificate. Caddy decrypts the request, opens a separate HTTPS connection through the firewall to Proxmox in Management, and verifies the Proxmox certificate.
    MAC("Mac browser")
    CADDY["Caddy proxy VM<br/>Services VLAN"]
    PVE["Proxmox management<br/>Management VLAN"]

    MAC -->|"HTTPS through firewall"| CADDY
    CADDY -->|"Separate HTTPS through firewall"| PVE

    class MAC source;
    class CADDY,PVE process;
```

I’d been thinking about a similar problem for my multi-agent system. Its services could get certificates the same way and verify each other over direct connections. I wanted Caddy for the pages I open in my browser.

## Getting a certificate for a private name

I could run my own certificate authority and install its CA certificate on each device. I already owned a domain, so I went with [Let’s Encrypt](https://letsencrypt.org/docs/challenge-types/). It can verify control of the name through DNS and issue a certificate without an inbound connection to the lab.

I used [Lego](https://github.com/go-acme/lego) to request the certificate. Let’s Encrypt gives it a challenge, and Lego uses the [Cloudflare DNS API](https://developers.cloudflare.com/dns/) to publish a temporary TXT record in my domain’s public DNS. Let’s Encrypt checks that record to confirm I control the name. My Mac uses the gateway’s local record when I open Proxmox.

<figure class="blog-illustration">
  <picture data-theme="light">
    <source media="(max-width: 40rem)" srcset="/blog/private-https-part12-phone.png" width="585" height="1509">
    <img src="/blog/private-https-part12.png" width="1320" height="863" loading="lazy" alt="Lego uses Cloudflare DNS to prove control of the name to Let’s Encrypt. Separately, the browser connects to Caddy, which connects to Proxmox. Both HTTPS connections stay inside the lab.">
  </picture>
  <picture data-theme="dark">
    <source media="(max-width: 40rem)" srcset="/blog/private-https-part12-phone.png" width="585" height="1509">
    <img src="/blog/private-https-part12-dark.png" width="1320" height="863" loading="lazy" alt="Lego uses Cloudflare DNS to prove control of the name to Let’s Encrypt. Separately, the browser connects to Caddy, which connects to Proxmox. Both HTTPS connections stay inside the lab.">
  </picture>
  <figcaption>Let’s Encrypt verifies the name through public DNS. Opening the console uses two HTTPS connections inside the lab.</figcaption>
</figure>

Caddy and Lego run under separate accounts on the same VM. The Cloudflare token can change DNS records across my domain, so I gave it to Lego alone. Caddy reads the issued certificate and private key to serve HTTPS.

I started with Let’s Encrypt’s test environment, called staging. I wanted to check that I could get a certificate, serve it from Caddy, and use the connection to sign in to Proxmox and keep a VM console open.

My first certificate request timed out. When Lego checked for the public TXT record, the gateway was still returning a cached answer from before the record appeared. I gave DNS more time on a supervised retry. Lego got the certificate, and I checked both authoritative nameservers to make sure it had removed the temporary record.

The staging setup checks that the certificate matches the private key before putting the pair where Caddy can read it. I gave it a mismatched pair in a test. It kept the previous pair selected and skipped the reload.

## From my Mac’s address bar to the Proxmox dashboard

I open the private Proxmox URL on my Mac while signed out. For this walkthrough, the Mac has to look up the name and the browser has to open a fresh connection. On later visits, they can reuse a cached answer or an open connection.

**1. My Mac finds the address.** The gateway’s local DNS record points to the IP address reserved for the proxy VM. In staging, I connected by name from my Mac and verified that it reached that address. The browser keeps the hostname from the URL so it knows which certificate name to check.

```mermaid size=standard caption="DNS supplies the destination address. The browser still verifies the original hostname."
---
config:
  sequence:
    width: 78
    height: 32
    actorMargin: 18
    diagramMarginX: 8
    mirrorActors: false
    messageMargin: 26
---
sequenceDiagram
    accTitle: Finding the private proxy
    accDescr: On a fresh lookup the client asks the UniFi gateway for the private service name and receives Caddy’s internal address from a local DNS record. The client then connects to Caddy, which presents the certificate for the requested name.
    participant B as Client
    participant D as UniFi gateway DNS
    participant C as Caddy
    B->>D: Look up service name
    D-->>B: Proxy’s private address
    B->>C: Connect to that address
    C-->>B: Certificate for the name
```

**2. The first packets cross the lab.** From my Mac, Ethernet goes straight to the lab gateway. Wi-Fi goes through an access point that’s wired to the same gateway. The Mac’s routing table picks the gateway as the next hop across VLANs. With IPv4, the Mac uses ARP if it needs the gateway’s Ethernet address. The frame goes to the gateway. The IP packet inside it is still addressed to the proxy VM.

The gateway checks its firewall rules and routes the packets to Services over the Proxmox host’s physical link. A virtual bridge on the host delivers them to the proxy VM’s virtual network card.

**3. The browser establishes HTTPS with Caddy.** The Mac opens a TCP connection, then the browser starts the TLS handshake with the name from the URL. Caddy presents the certificate chain it has loaded and proves it holds the matching private key. The browser checks the hostname, validity dates, and chain back to a trusted authority. The session keys established during the handshake protect the HTTP traffic.

For this test, I trusted Let’s Encrypt’s staging authority. From my Mac, I compared the fingerprint of the certificate Caddy sent with the one I’d installed. They matched.

```mermaid size=compact caption="Follow one successful visit from top to bottom. The browser can verify Caddy before Caddy has fetched a single byte of the Proxmox page."
---
config:
  flowchart:
    padding: 9
    nodeSpacing: 16
    rankSpacing: 22
---
flowchart TB
    accTitle: From opening a private URL to receiving the Proxmox page
    accDescr: The Mac resolves the private name, reaches the proxy through the lab gateway, and opens TCP and completes TLS with Caddy. The browser sends the encrypted page request. Caddy opens separate verified HTTPS to Proxmox. The login page returns through Caddy to the Mac.
    MAC("Mac opens private URL")
    DNS["Gateway DNS returns<br/>the proxy address"]
    LAN["Ethernet or Wi-Fi<br/>through the lab gateway"]
    TLS["Mac opens TCP and<br/>verifies Caddy over TLS"]
    UP["Caddy opens TLS<br/>and verifies Proxmox"]
    PAGE["Proxmox sends login page"]
    RESULT[["Browser displays page"]]

    MAC --> DNS --> LAN --> TLS
    TLS -->|Encrypted page request| UP
    UP -->|Fetch dashboard| PAGE
    PAGE -->|Proxmox → Caddy → Mac| RESULT

    class MAC source;
    class DNS,LAN,TLS,UP,PAGE process;
    class RESULT evidence;
```

**4. Caddy connects to Proxmox.** Caddy decrypts the browser’s request and uses the hostname to pick the Proxmox route. For the second HTTPS connection, Caddy is the TLS client. It checks that the upstream certificate matches the configured server name and chains back to the lab’s cluster authority. This connection has its own session keys.

I checked the upstream name and chain from the proxy VM during setup. In an isolated test, I gave Caddy the wrong server name and then the wrong certificate authority. It rejected the upstream both times.

**5. The login page comes back.** Caddy relays the response over the first HTTPS connection. In staging, my browser got HTTP 200 and displayed the sign-in page.

## Following the sign-in and the console

I used the same private address to sign in and open the console for the VM running Caddy. Proxmox checked my credentials and handled the console connection to the guest.

```mermaid size=standard caption="The sequence groups the requests involved in signing in and opening the console."
---
config:
  sequence:
    width: 77
    height: 32
    actorMargin: 18
    diagramMarginX: 8
    mirrorActors: false
    messageMargin: 23
---
sequenceDiagram
    accTitle: Following a login and a live console
    accDescr: An approved browser requests the login page from Caddy. Caddy asks Proxmox over verified HTTPS and relays its response. Proxmox handles sign-in. Opening a console establishes a WebSocket through the proxy, carrying input to Proxmox and display updates back to the browser.
    participant B as Browser
    participant C as Caddy
    participant P as Proxmox
    B->>C: Open page
    C->>P: Fetch page
    P-->>C: Login page
    C-->>B: Login page
    B->>C: Sign in
    C->>P: Forward sign-in
    P-->>C: Session
    C-->>B: Session
    B->>C: Open WebSocket
    C->>P: Open WebSocket
    B->>C: Keyboard input
    C->>P: Relay input
    P-->>C: Display updates
    C-->>B: Relay updates
```

I checked that the WebSocket stayed open. It carries keystrokes from my browser to Proxmox and screen updates back through Caddy.

I tried reaching Caddy from two unapproved clients. One was on the same network as the proxy, and the other had to cross the gateway. Both connections timed out.

## Getting back in if the proxy stops

I tested the direct route to Proxmox with Caddy stopped. In a follow-up check, I used a temporary browser profile that trusted the lab’s verified certificate authority. I opened Proxmox by the name on its own certificate and reached the proxy VM’s login prompt.

I restored the staging backup into a temporary Debian VM with no network adapter. I ran a small HTTPS service inside that VM in place of Proxmox. The restored Caddy served the expected staging certificate and forwarded the request to the local service.

```mermaid size=standard caption="I tested access to the live console separately from restoring the staging backup."
---
config:
  flowchart:
    padding: 7
    nodeSpacing: 13
    rankSpacing: 26
---
flowchart TB
    accTitle: Two separate recovery tests
    accDescr: On the live lab, an approved browser connects directly to Proxmox and opens the proxy VM console. In a separate offline guest, restored Caddy connects to a local test service. No connection crosses between these tests.
    subgraph DIRECT["Direct console access"]
        direction TB
        B("Admin browser")
        P["Proxmox"]
        V[["Proxy VM console"]]
        B -->|Direct HTTPS| P --> V
    end
    subgraph RESTORE["Isolated restore"]
        direction TB
        R["Restored Caddy"]
        L["Test service"]
        OK[["HTTP 200"]]
        R -->|Local HTTPS| L --> OK
    end

    class B source;
    class P,R,L process;
    class V,OK evidence;
```

By November 18, Lego had obtained a production certificate and I’d verified it on disk. I opened a fresh connection to check what Caddy served. My browser still received the staging certificate. I recorded that result and left the switch for the next deployment.
