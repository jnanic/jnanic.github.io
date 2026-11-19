---
title: "Building My Proxmox Homelab, Part 9: Turning a ThinkPad Into a Compute Node"
description: "How I put a ThinkPad GPU to work from my Mac, what the benchmarks showed about power and heat, and what Daedalus still needs to run unattended."
publishedDate: "2026-11-20"
draft: true
tags:
- Homelab
- Linux
- GPU
- CUDA
- Jupyter
- PyTorch
- llama.cpp
- Wake-on-LAN
---

<img src="/blog/whatismypurpose_daedalus.jpg" alt="Daedalus, the Butter Robot, asks “What is my purpose?” Rick replies, “You upscale videos, fine-tune models, generate images, and crank out photo embeddings.” Daedalus says, “Oh my God.”" width="500" height="748" style="max-width:100%;height:auto">

I wanted a general-purpose compute node for the homelab and already had a ThinkPad with a GPU. After moving it onto the Compute network, I used Jupyter over SSH to check that I could work on it from my Mac. [Part 8 covers the network move.](/blog/building-my-homelab-part8/)

## Making room for Ubuntu

Daedalus is a ThinkPad X1 Extreme Gen 5 with a Core i9-12900H and an RTX 3080 Ti Laptop GPU with 16 GiB of VRAM. I set it up as a standalone Ubuntu host and kept Windows available.

I named it after [Daedalus](https://en.wikipedia.org/wiki/Daedalus), the Greek craftsman who built the Labyrinth and made wings from feathers and wax, because I liked the idea of using the hardware I already had to build something the lab was missing.

I copied the old data off the laptop before changing the partition layout. I’d left free space for Ubuntu Server 26.04.1 LTS, but the installer didn’t offer it as an editable partition. I went back into Windows, created an unformatted partition in that space, and selected it in Ubuntu’s custom installer. I reused the existing EFI system partition. After the install, I booted Windows and opened both retained Windows volumes. BitLocker reported protection on.

Ubuntu’s first package update failed with a name resolution error. The Ethernet adapter showed a link, but it had no IPv4 address and the machine had no default IPv4 route. Enabling DHCP in the existing Netplan entry got the update working.

## What I could run on Daedalus

I wanted a machine I could give different jobs as they came up. I could send it a batch of videos to transcode, run a long build, or try a model on its GPU. Other services could eventually send it work too. [Immich](https://docs.immich.app/guides/remote-machine-learning/) could send image previews for Smart Search and face detection, and a local voice assistant could use it to transcribe speech or generate a spoken reply.

Jupyter gave me a way to test working on the node remotely. I set up Python with uv and verified that PyTorch could run a matrix calculation on the GPU. After the move to Compute, I checked Daedalus’s host key against the one I had saved and logged in with my dedicated Mac key. Jupyter listened on the laptop’s loopback interface, and I reached it through an SSH local forward.

```mermaid size=compact caption="Jupyter stays on loopback on the ThinkPad. The Mac reaches it through SSH."
flowchart TB
    accTitle: Accessing Jupyter on Daedalus from the Mac
    accDescr: The Mac browser connects through an SSH local forward to Jupyter on Daedalus. Jupyter listens on the ThinkPad loopback interface, and the notebook kernel runs PyTorch work on the laptop GPU.

    MAC("Browser on the Mac")
    SSH["SSH local forward"]
    JUPYTER["Jupyter on Daedalus<br/>Loopback listener"]
    GPU(["PyTorch calculation<br/>runs on the laptop GPU"])

    MAC --> SSH --> JUPYTER --> GPU

    class MAC source;
    class SSH,JUPYTER process;
    class GPU approved;
```

Daedalus could resolve public names and reach websites over HTTPS. My test connections from Compute to management SSH, TrueNAS NFS, and Core’s Docker proxy timed out.

## What changed when I plugged it in

I ran the same synthetic PyTorch benchmark on AC and battery. On the heavier GPU tests, AC was about 36–40% faster. The benchmark kept tensors on the device and timed the computation itself.

I also built `llama.cpp` with CUDA and ran Qwen2.5-7B-Instruct at `Q4_K_M` quantization.

| Test | Throughput |
| --- | ---: |
| Process a 512-token prompt | About 2,083 tokens/s |
| Process a 4,096-token prompt | About 1,897 tokens/s |
| Generate 128 tokens from zero initial context depth | 37.52 tokens/s |

## Testing with the lid closed

Changing the lid policy let me close the ThinkPad and stay connected over SSH. I then tried a longer run with the lid closed and the laptop upside down. The GPU reached 91°C, reported software thermal slowdown, and dropped to 210 MHz. The CPU package reached about 97°C.

I tried a short run with the fans at manual level 7. Across three runs that each generated 512 tokens at a context depth of 4,096 tokens, I measured a mean of 39.38 tokens/s. The GPU stayed around 50–60°C with no reported software thermal slowdown during that trial, while the CPU still reached 96°C. I returned the fans to automatic afterward.

The thermal runs differed in duration and fan setting, and the effect of laptop orientation is still an open question. The earlier 37.52 tokens/s figure also came from a different generation workload. I’d need a longer test with those conditions controlled before relying on this cooling setup for unattended jobs.

## Waking Daedalus for a job

I’d like Daedalus to sleep when it’s idle and use Wake-on-LAN when I or an approved service needs its GPU. I still need to test which power states the laptop can reliably wake from over Ethernet. Running jobs and file transfers need a way to keep it awake.

I’d start by testing several sleep-and-wake cycles while I’m there to recover the machine. After each wake, I’d check that SSH comes back and a small GPU job finishes. Then I can measure how much power sleep saves and how long a service would have to wait for the GPU.

### When Immich has a batch of photos

A batch of new photos in Immich would give me a job to test. I’d hold the image-analysis jobs in a queue on an always-on host while Daedalus sleeps. An approved service would wake the laptop, then wait for its worker to process a test image before sending the batch.

If the laptop failed to wake or the worker never became ready, I’d leave the jobs queued for a retry and log which step timed out. After the batch finished, Daedalus could go back to sleep once the queue was empty and its other jobs had finished.
