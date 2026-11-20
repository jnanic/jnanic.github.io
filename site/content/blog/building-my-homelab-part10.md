---
title: "Building My Proxmox Homelab, Part 10: One Lab, Three Maps"
description: "How I used Homelable to map what shares hardware, which jobs cross VLANs, and what would come back from a backup."
publishedDate: "2026-11-21"
draft: true
tags:
- Homelab
- Homelable
- Proxmox
- Networking
- VLANs
- Backups
---

<img src="/blog/three-maps-part10.jpg" alt="Charlie gestures at a wall of notes and red string. The caption reads, ‘The diagram is simple if you let me finish.’" width="577" height="433">

Paperless and TrueNAS run as separate guests on the same Proxmox host. They sit on different VLANs, and their data has different recovery paths. If I restore the application VM after a bad update, I can get its database back from the guest archive and still need TrueNAS to open a document.

After moving the network and bringing Daedalus into the lab, I wanted a map I could use when something broke. I made three views in Homelable. One shows what shares hardware, one shows which services talk across networks, and one shows what I’d need to recover. The figures here are simplified views of the same lab. [Part 8 covers the network move.](/blog/building-my-homelab-part8/)

## What shares hardware

The first view follows the physical links from the ISP gateway to my UniFi gateway and out to the devices connected to it. Proxmox and the compute laptop each have their own Ethernet connection. The access point has one too, and a personal client can reach the gateway over Ethernet or through Wi-Fi.

<figure class="blog-image-figure">
  <a href="/blog/homelable-topology-part10.jpg" data-image-dialog="part10-topology-dialog" aria-haspopup="dialog" aria-controls="part10-topology-dialog">
    <img src="/blog/homelable-topology-part10.jpg" alt="The ISP gateway connects to a UniFi gateway, with Ethernet links to Proxmox, a compute laptop, an access point, and a personal client. Proxmox hosts the application VM and TrueNAS, along with the controller, integration environment, and other guests. The application VM runs Paperless, FreshRSS, and Homelable." width="2405" height="992">
  </a>
  <figcaption>Solid lines show Ethernet. The blue dashed line is Wi-Fi, and gray dashed lines show what runs on each host. Select the image to open it full size.</figcaption>
</figure>

<dialog id="part10-topology-dialog" class="blog-media-dialog blog-image-dialog" aria-labelledby="part10-topology-title">
  <div class="blog-media-dialog__header">
    <p id="part10-topology-title">Full-size homelab topology</p>
    <form method="dialog"><button type="submit" class="blog-media-dialog__close" autofocus>Close</button></form>
  </div>
  <div class="blog-media-dialog__viewport" role="region" aria-label="Scrollable topology image" tabindex="0">
    <img src="/blog/homelable-topology-part10.jpg" alt="Full-size map of the gateway connections, Proxmox guests, and applications described in the article." width="2405" height="992">
  </div>
</dialog>

The hosting lines answer a question I can miss when looking at a list of separate services. An outage on the Proxmox host would take both the application VM and the TrueNAS guest offline. Daedalus has its own hardware and a separate connection to the gateway. It still depends on that network path when I use it from my Mac.

## Which jobs cross VLANs

The second view groups devices and guests by what they do. In the diagram, each arrow starts where the request starts. The management controller runs a rehearsal on the Integration test VM. My Mac opens a TrueNAS file share over SMB. The application VM mounts the document share over NFS so Paperless can read and write files. The compute laptop has a zone of its own and takes no part in those three workflows.

```mermaid size=standard caption="The three arrows show who starts each request. The shaded boxes show VLAN membership."
---
config:
  flowchart:
    padding: 8
    nodeSpacing: 16
    rankSpacing: 30
---
flowchart TB
    accTitle: Six homelab VLANs and three connections
    accDescr: Each shaded box names a VLAN and contains a representative device. The Management controller starts rehearsals on the Integration test VM. The Personal Mac opens a TrueNAS share in Storage over SMB. The Services app VM mounts documents from TrueNAS over NFS. Compute contains the compute laptop and is outside these three workflows.
    subgraph M["Management VLAN"]
        CTRL["Controller"]
    end
    subgraph I["Integration VLAN"]
        TEST["Test VM"]
    end
    subgraph P["Personal VLAN"]
        PEOPLE["Personal Mac"]
    end
    subgraph C["Compute VLAN"]
        LAPTOP["Compute laptop"]
    end
    subgraph S["Services VLAN"]
        APPS["App VM"]
    end
    subgraph T["Storage VLAN"]
        NAS["TrueNAS"]
    end
    M -->|Runs rehearsals| I
    P -->|Opens a share<br/>via SMB| T
    S -->|Mounts documents<br/>via NFS| T
    %% Invisible links keep the three workflows in reading order on narrow screens.
    I ~~~ P
    C ~~~ S
    class CTRL,TEST,PEOPLE,LAPTOP,APPS,NAS process;
```

I originally drew a line from Gramps Web to the shared PostgreSQL service. When I checked its configuration, I found local application state and a dedicated Valkey service, so I removed the PostgreSQL line. I now treat those lines as dependencies I can check against configuration or a real request. Firewall rules and access tests have their own records.

## What comes back from the guest archive

Take a receipt that Paperless already knew about when the application VM backup ran. Its database record is on the guest disk, along with the application settings. The PDF lives on a TrueNAS share that the guest mounts over NFS. If I lose the application VM, I can restore its disk from the guest archive and remount the document share. If I also lose the NAS copy, I need another copy of the PDF to get it back. [Part 4 covers the Paperless storage setup.](/blog/building-my-homelab-part4/)

```mermaid size=standard caption="The VM archive, same-pool snapshot, and database dump cover different parts of recovery."
---
config:
  flowchart:
    padding: 8
    nodeSpacing: 16
    rankSpacing: 30
---
flowchart TB
    accTitle: Recovery paths for a Paperless receipt
    accDescr: The guest archive restores Paperless settings and the receipt record. The document share on TrueNAS holds the PDF. A snapshot can supply an earlier PDF version if the pool survives. Loss of the pool also loses its snapshots. In a separate isolated rehearsal, the restored PostgreSQL database answered queries. A full recovery still needs a test that opens the PDF in Paperless.
    subgraph V["From the VM backup"]
        direction TB
        ARC[["Guest disk archive"]]
        DATA("Settings and<br/>receipt record")
        ARC -->|restore guest disk| DATA
    end
    subgraph N["On TrueNAS"]
        direction TB
        SHARE["Document share"]
        PDF("Receipt PDF")
        SHARE -->|still holds| PDF
    end
    subgraph R["Isolated PostgreSQL rehearsal"]
        direction TB
        DUMP[["PostgreSQL dump"]]
        QUERIED(["Restored database<br/>answered queries"])
        DUMP -->|restore and query| QUERIED
    end
    subgraph S["Snapshot on the same TrueNAS pool"]
        direction TB
        SNAP[["Pool snapshot"]]
        OLD("Earlier PDF version")
        LOST{{"Snapshot lost<br/>with the pool"}}
        SNAP -->|pool survives| OLD
        SNAP -->|pool lost| LOST
    end
    V ~~~ R
    N ~~~ S
    class ARC,DUMP,SNAP evidence;
    class DATA,PDF,OLD source;
    class SHARE process;
    class QUERIED approved;
    class LOST failure;
```

A full Paperless recovery would also need to open a document from the recovered storage.

## How I keep the maps up to date

Adding the staging proxy in November gave me a reason to open all three canvases. I added the guest under Proxmox, put its service in the right VLAN, and recorded where its recovery material lived. I saved and reopened the views to check that the edits stuck.

I update the maps after a change goes live, when I can check where something runs and what it actually uses. The private map also links to the runbooks. I revisit those links when a runbook moves or the underlying setup changes. When I swap a cable, move a guest, or change a mount, I can update the view that explains the change.

The maps now show where the proxy runs and where I keep its recovery material. When I was still designing it, the proposal, the review comments, and several unfinished edits lived on my Mac. In Part 11 I’ll show how I moved that work into a Linux VM and checked that I could pick up the same review there.
