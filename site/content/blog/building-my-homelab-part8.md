---
title: "Building My Proxmox Homelab, Part 8: Moving the Network Without Losing the Lab"
description: "How I moved the homelab behind a UniFi gateway, preserved storage-dependent services, and tested the access boundaries and IPS behavior afterward."
publishedDate: "2026-10-04"
draft: true
tags:
- Homelab
- Proxmox
- Networking
- UniFi
- Security
---

<img src="/blog/moving-one-cable-part8.png" alt="Astronaut bracing for a maneuver. Caption: “Me moving one cable to make my PC look cleaner.” Response: “This little maneuver is gonna cost us 51 years.”" width="500" style="max-width:100%">

By the end of Part 7, I had a workflow for reviewing agent-written changes and testing them before production. The network underneath that workflow needed some attention too.

The lab had accumulated application services, storage, management tools, an integration environment, and a laptop I wanted to use for compute. Each needed different access. Moving everything behind Janus, my UniFi gateway, gave me a chance to make those differences explicit.

The name comes from [Janus](https://en.wikipedia.org/wiki/Janus), the Roman god associated with doorways, gates, and beginnings, usually depicted with two faces looking in opposite directions. It fits the gateway’s job of controlling traffic between the lab and the outside world, as well as between its internal networks.

An early attempt to move the Proxmox connection interrupted access to the lab. Returning the cable to its previous connection restored access, and I paused the migration to map out the dependencies.

I had DHCP reservations ready, but several machines already used static addresses. Applications also had addresses embedded in port bindings, storage mounts, firewall rules, and configuration files. Those all needed to agree after the move.

## Six networks with different jobs

I divided the lab into six networks:

| Network | What belongs there |
| --- | --- |
| Management | Proxmox administration, the automation controller, and management tools |
| Personal | My everyday devices, Wi-Fi clients, and coursework guests |
| Services | Core and its application services |
| Storage | TrueNAS |
| Compute | Daedalus, the laptop compute node |
| Integration | The persistent environment for testing changes |

The intended access depended on the device and the destination. My Mac needed administration access. An ordinary phone needed working internet without access to the server management pages. Core needed its approved storage connections. Daedalus needed internet access without general access to management, storage, or Docker administration.

The Archer stayed as the Personal access point. Giving its 2.4 GHz and 5 GHz radios different names would not create a separate IoT network, so I left that work for later.

The spare managed switch had a different problem. Its management interface remained reachable in a test where I expected it to be isolated. Separate forwarding tests showed the tested client traffic was being separated correctly, but the switch’s own administration boundary was still unsuitable for the planned placement. I kept it out of the initial production path.

Coursework guests also remained on Personal. That was an accepted limitation of this stage.

## Preparing for a coordinated outage

Before changing the Proxmox network configuration, I confirmed that I could use its physical console. Losing SSH during a network migration was something I needed to be able to recover from locally.

I saved configuration copies and prepared the changes on both sides of each connection.

Moving Core meant updating more than its guest address. Its published application ports needed the new binding. Its NFS mounts needed the new storage destination, and TrueNAS needed to recognize the new client address. The automation controller, dashboard links, inventories, and firewall rules had their own references to update.

I applied the network and application changes together while the guests were stopped:

```mermaid size=standard caption="Coordinated network cutover and storage-first recovery"
flowchart TB
    accTitle: Coordinated network migration and storage-dependent recovery
    accDescr: Network placement changes and service configuration changes are applied together while guests are stopped. TrueNAS and the required datasets recover before Core applications and the Paperless storage gate.

    NETWORK["Network placement<br/>Proxmox bridge and guest VLANs"]
    CONFIG["Service dependencies<br/>Addresses, bindings, mounts and rules"]
    APPLY["Apply matching configuration<br/>while guests are stopped"]
    STORAGE["Recover TrueNAS<br/>Unlock required datasets"]
    APPS(["Recover Core applications<br/>Paperless starts after its storage gate passes"])

    NETWORK --> APPLY
    CONFIG --> APPLY
    APPLY --> STORAGE --> APPS

    class NETWORK,CONFIG,APPLY,STORAGE process;
    class APPS approved;
```

>*The network configuration and application dependencies move together. Recovery follows the storage dependency.*

I stopped the applications using storage before shutting down their guests, with TrueNAS stopped last. On recovery, TrueNAS came back first, and I unlocked the required datasets before bringing the dependent applications back.

The Paperless storage gate from Part 4 required Paperless to find the expected storage and pass its access checks before starting.

I recovered the existing application versions during the migration. Keeping upgrades out of the cutover made failures easier to trace to an address, dependency, or access rule.

Afterward, Homepage, Gramps Web, Paperless, and FreshRSS worked in the checks I performed. The n8n and Open WebUI pages were reachable, although their account recovery remained separate work.

## Checking who could connect

A failed connection alone was ambiguous. It could mean the firewall blocked it, the destination was down, or the client had lost connectivity.

I paired denied connections with checks that something appropriate still worked.

| Boundary | Expected access that worked | Access that failed as intended |
| --- | --- | --- |
| Gateway administration | My designated Mac could open Janus administration | An ordinary phone could not, while its internet still worked |
| Server administration | My Mac reached the reviewed Proxmox, TrueNAS, and Core web endpoints | The phone could not reach those endpoints |
| Docker status access | Homepage could query the Docker socket proxy | My Mac could not query it directly |
| Compute isolation | Daedalus could resolve public names and reach public HTTPS sites | Its tested connections to management SSH, NAS NFS, and the Core Docker proxy timed out |

These were representative checks of specific paths. They gave me evidence for the boundaries I had tested without claiming that every port and protocol had been audited.

I also narrowed remote access through Tailscale. The reviewed Mac access covered coursework SSH and Proxmox web administration. Fresh tests confirmed those connections worked, while the phone and coursework guest could not use the tested Proxmox administration path.

DNS got a small recovery exercise too. I verified the gateway’s encrypted forwarding through Quad9, tried the selected encrypted fallback provider, and restored Quad9 afterward. The fallback remained a manual procedure.

## The IPS setting that needed a traffic test

I used a harmless request designed to match an IPS signature. In notification mode, Janus recorded the detection and allowed the request, as expected.

Then I selected **Notify and Block** and repeated the test. The request still returned HTTP 200.

The inspection engine was running. The generated configuration included a drop action for the signature. A packet capture still showed a complete successful response.

```mermaid size=standard caption="A second traffic test established whether IPS blocking took effect"
flowchart TB
    accTitle: Verifying IPS enforcement before and after a gateway restart
    accDescr: With blocking selected, the harmless signature test initially still receives a successful response. After a gateway restart, the repeated test times out with a matching block event, while normal connectivity also passes.

    MODE["Select Notify and Block<br/>Repeat the harmless signature test"]
    UNEXPECTED{{"HTTP 200 still returned<br/>Blocking not demonstrated"}}
    RESTART["Restart Janus<br/>Repeat both kinds of check"]
    BLOCKED(["Signature test times out<br/>Matching Block event appears"])
    NORMAL(["Normal websites, SSH<br/>and Homepage still work"])

    MODE --> UNEXPECTED --> RESTART
    RESTART --> BLOCKED
    RESTART --> NORMAL

    class MODE,RESTART process;
    class UNEXPECTED failure;
    class BLOCKED,NORMAL approved;
```

>*The repeated request established whether blocking took effect. Ordinary connectivity checks confirmed that normal traffic still worked.*

After restarting Janus, the same test timed out and produced a matching Block event. Normal websites, SSH, and Homepage continued to work.

I never established the underlying cause of the earlier behavior. The restart resolved the observed symptom, and the repeated test confirmed enforcement for that signature.

Shortly afterward, legitimate GitHub SSH traffic hit another problem. Git operations timed out, and Janus recorded a matching outbound SSH scan alert.

I configured the existing GitHub alias to use GitHub’s alternate SSH endpoint on port 443, retaining the read-only deploy identity. I verified the effective SSH configuration and successfully read the repository’s remote branch reference.

That connection still uses SSH. The port change did not require broader repository permissions or disabling IPS.

## What recovery still needs

The migration finished with the reviewed services reachable and the tested access boundaries behaving as intended. Backup continuity checks also found recent Proxmox guest archives, and I saved fresh gateway and TrueNAS configuration exports.

I had not performed a new isolated restore from those backups. I also had not tested a complete Proxmox reboot or a blackout recovery sequence as part of this cutover. Those need their own exercises.

I kept the old ISP Wi-Fi available for emergency internet access from my Mac. It bypasses Janus’s controls and does not restore access to the lab’s management interfaces. The physical console and saved configuration remain part of recovering the lab itself.

## Coming next

Daedalus now had its Compute network placement, working SSH, and a Jupyter session accessible through an SSH tunnel. Other services did not depend on it yet.

In Part 9, I’ll cover how I brought that laptop into service, its current setup, and the work still needed to manage its power lifecycle and let other services use it for compute.
