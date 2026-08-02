---
title: "Building My Proxmox Homelab, Part 1: Planning the Hardware"
description: "How I planned a quiet, upgradeable Proxmox homelab for development, OMSCS coursework, self-hosting, and future local AI workloads."
publishedDate: "2026-08-02"
draft: false
tags:
  - Homelab
  - Proxmox
  - Self-hosting
  - Virtualization
  - Linux
  - Hardware
---

> In Part 1, I explain why I wanted a homelab, why my old desktop was not the right long-term platform, and how I chose the hardware and overall design before placing the order.

<img src="/blog/jar.jpeg" alt="swear jar vs home server jar" width="480" style="max-width:100%">

I had wanted a homelab for a while, but I did not want to build a server simply because having one sounded interesting. I wanted a clear purpose for it.

The system needed to support development work, OMSCS coursework, self-hosted applications, infrastructure experiments, and eventually private AI workloads. It also needed to be reasonably quiet, efficient at idle, easy to upgrade, and independent of my main laptop.

What began as “a small server at home” quickly expanded into virtual machines, containers, storage planning, networking, backups, Kubernetes, power management, and future GPU upgrades.

Apparently, this is how homelabs happen.

I am documenting the project as I build it, partly to keep a record of the decisions and mistakes, and partly because practical homelab write-ups helped me understand what I was getting into. I hope this series can do the same for someone else starting with a pile of old hardware and an ambitious plan.

## Why I decided to build one

My immediate goal was to create a dedicated Linux environment for development and coursework. I am preparing for OMSCS work involving machine learning and high-performance computer architecture, and I wanted a system I could modify, break, restore, and rebuild without affecting my everyday computer.

Proxmox made that appealing. Instead of dedicating the entire machine to one operating system, I could use it as a virtualization host and create separate environments for different jobs.

The first major workload would be an Ubuntu development VM for:

- Python and machine-learning work
- Systems programming
- VS Code and course-specific tools
- Experiments I did not want installed on my main laptop

Beyond coursework, I also wanted to explore self-hosted services such as Paperless, n8n, Open WebUI, monitoring tools, and eventually an ARR media stack.

A homelab would also force me to learn the less glamorous parts of infrastructure: storage health, backups, network addressing, recovery, monitoring, and graceful shutdowns. Managed services hide many of those details. Running the hardware myself would make them impossible to ignore.

Local AI was another motivation. My laptop already had an NVIDIA GPU with 16 GB of VRAM, and I wanted the option to add a GPU to the server later. The goal was not to avoid every hosted AI service, but to keep sensitive documents, notes, and experiments local when that made sense.

Most importantly, I wanted a machine I could grow into rather than a finished “forever build” on day one.

## Starting with the hardware I already had

Before ordering anything, I looked at an older desktop I already owned:

- Intel Core i5-4570
- Gigabyte B85M-D3H motherboard
- A small amount of DDR3 memory
- Several old SATA hard drives
- An older SATA SSD

It was still useful for learning. It could boot Linux, run lightweight services, and act as a temporary test system.

But it was not the foundation I wanted for a multi-year homelab.

The i5-4570 had four cores and four threads. That was enough for a basic file server or a few containers, but it left limited headroom for a desktop VM, background services, monitoring, and future experiments running together.

Memory was another constraint. The available DDR3 modules were small and mismatched, while my target was 32 GB initially with a straightforward path to 64 GB.

Power efficiency and noise also mattered. The server would spend much of its life at low utilization, so a newer platform made more sense than continuing to invest in an old one that would run continuously.

The storage looked promising on paper: several 500 GB drives, a 1 TB drive, a 2 TB drive, and an old SSD. In reality, I did not yet know which disks were healthy enough to trust.

Before reusing them, I would eventually need to answer:

1. Which drives were still healthy?
2. Which contained data worth preserving?
3. Which should be retired?

For planning purposes, I treated all existing disk capacity as provisional.

The old system had successfully completed its first task: convincing me to buy newer hardware.

## Choosing the new components

The challenge was choosing enough hardware for the project without accidentally turning a practical homelab into an expensive workstation.

It is surprisingly easy to start with “I need a small server” and end up comparing Xeons, Threadrippers, ECC memory, 10-gigabit networking, and rack-mounted systems that solve problems you do not actually have.

I settled on this initial configuration:

| Component | Choice |
|---|---|
| CPU | Intel Core i5-14400 |
| Motherboard | ASUS EX-B760M-V5 DDR4 |
| Memory | 32 GB DDR4 |
| Primary storage | WD Black SN7100 500 GB NVMe |
| Power supply | Corsair RM750e 750 W |
| CPU cooling | Intel stock cooler |
| Graphics | Intel integrated graphics |
| Bulk storage | Existing SATA drives, pending health checks |

### CPU: Intel Core i5-14400

The processor needed enough flexibility for a development VM, containers, and future services without pushing the build into workstation pricing.

The i5-14400 offered a practical balance of performance, efficiency, and cost. Its mix of performance and efficiency cores provided far more room than the old four-core desktop.

I also chose the regular model rather than the `F` version. Because I was not buying a dedicated GPU immediately, integrated graphics gave me display output for installation and troubleshooting, plus a useful fallback later.

### Memory: DDR4 now, 64 GB later

I considered DDR5, but the combined motherboard and memory cost was higher.

For my workloads, memory capacity mattered more than maximum bandwidth. Virtual machines and containers consume RAM quickly, so I preferred a cheaper path to more capacity.

I planned to begin with one 32 GB DDR4 module and add a matching second module later:

```text
Initial configuration: 32 GB
Planned upgrade:       64 GB
```

A single module would sacrifice some performance until the upgrade, but it avoided buying two smaller modules that might later need replacing.

### Motherboard: practical rather than premium

I chose the ASUS EX-B760M-V5 DDR4 because it covered the requirements that mattered:

- Support for the i5-14400
- An NVMe slot
- SATA ports for existing drives
- A PCIe slot for a future GPU
- Enough memory capacity for the planned upgrade
- Integrated networking and display output

It did not offer workstation features such as remote management, ECC memory, or multiple high-speed network interfaces. Those would have been useful, but not useful enough to justify a much more expensive platform.

### Primary storage: 500 GB NVMe

A 1 TB NVMe would have been more comfortable, but I chose a 500 GB WD Black SN7100 for active workloads:

- Proxmox
- VM disks
- Containers
- Development environments
- Frequently accessed application data

Bulk media, archives, and backups could use SATA storage after the old drives had been tested.

The NVMe was meant to be fast working storage, not the archive for everything I owned.

### Power supply: room for a future GPU

The Corsair RM750e was much larger than the initial system required, especially without a dedicated GPU.

I chose it so I would not need to replace the power supply when adding a graphics card later. It also left room for more drives, expansion cards, and temporary power spikes.

This was one area where buying ahead of the immediate requirement made sense.

### No dedicated GPU yet

Local AI remained part of the plan, but a dedicated GPU was postponed.

I was interested in a future NVIDIA card with around 16 GB of VRAM, since memory capacity would matter for local models, embeddings, document processing, and image generation.

However, the first phase did not need one. Proxmox, development VMs, containers, storage work, and self-hosted applications could all begin on the CPU.

Waiting would also let real workloads guide the GPU purchase instead of guessing in advance.

### Stock cooling to establish a baseline

I planned to begin with the included Intel cooler.

It would be enough to assemble the machine and establish a baseline. If temperatures or noise became a problem under sustained workloads, I could replace it with an aftermarket cooler based on actual measurements.

## Planning beyond the parts list

The hardware was only one part of the design. I also wanted a rough plan for how the system would be organized.

```text
Physical server
└── Proxmox VE
    ├── Ubuntu development VM
    ├── Lightweight service containers
    ├── Storage and backup services
    └── Future experimentation environments
```

Proxmox would remain a relatively clean hypervisor. Development tools and applications would live inside VMs or containers rather than directly on the host.

My first Ubuntu VM was planned around:

```text
8 virtual CPU cores
16 GB RAM
100 GB virtual disk
```

Smaller services such as Paperless, n8n, Open WebUI, and monitoring tools could run in containers where appropriate.

The NVMe would hold active workloads, while healthy SATA drives could take on media, archives, and backups.

Networking would begin simply: a wired 1 GbE connection, a stable management address, local Proxmox access, and internet connectivity for updates. Managed switches, VLANs, and 2.5 GbE could wait until I had a real need for them.

Power reliability also influenced the plan. Outages are common where I live, so a UPS remained an important future upgrade. Its purpose would be to keep the server alive long enough for VMs and the host to shut down cleanly, not to run the entire lab indefinitely.

## Building in phases

To keep the project manageable, I divided it into stages.

### Phase 1: Establish the foundation

- Assemble the server
- Install Proxmox
- Configure networking
- Create the development VM
- Check stability and temperatures

### Phase 2: Organize storage

- Inspect the existing drives
- Preserve important data
- Retire unsafe disks
- Create a clearer backup structure

### Phase 3: Add services

- Paperless
- n8n
- Open WebUI
- Monitoring
- Other lightweight applications

### Phase 4: Expand

- Upgrade to 64 GB RAM
- Improve CPU cooling
- Add a UPS
- Add a dedicated GPU
- Experiment with Kubernetes and MLOps

The goal was not to buy everything required by the final vision. It was to establish a useful foundation and let actual limitations determine the next upgrades.

## Placing the order

After several rounds of comparisons—and trying not to redesign the entire server every time I found another motherboard—I finally placed the order.

The first purchase intentionally omitted the second memory module, aftermarket cooler, dedicated GPU, UPS, and new bulk-storage drives.

That was deliberate.

The initial configuration was enough to run Proxmox, create a comfortable development VM, host lightweight services, and begin evaluating the storage I already owned.

I could have spent more on DDR5, a larger NVMe, a higher-end motherboard, or a GPU. Each would have improved some aspect of the build, but buying everything immediately would have made the project much more expensive before I had run a single workload.

The configuration I chose was not optimized for maximum performance. It was optimized for flexibility.

At this point, the plan looked organized, sensible, and relatively straightforward.

The hardware had not arrived yet, which meant nothing had gone wrong.

In Part 2, I will assemble the system, install Proxmox, configure the first development VM, test the thermals, and find out which parts of this plan survive contact with the actual hardware.

<img src="/blog/fingers-crossed.gif" alt="fingers crossed" width="480" style="max-width:100%">
