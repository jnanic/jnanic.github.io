---
title: "Building My Proxmox Homelab, Part 11: Moving My Agent Workspace to a Linux VM"
description: "How I moved my Codex workspace and unfinished Git work to an Ubuntu VM on my Mac, then picked up the Caddy review and ran the checks there."
publishedDate: "2026-11-22"
draft: true
tags:
- Homelab
- Linux
- Virtualization
- Git
- Codex
- Code Review
---

In Part 10 I put a staging proxy on three maps. I could point to the guest on Proxmox, see which network it belonged to, and find its recovery material. What the maps didn’t show was where I’d worked through the design. When I moved my development workspace, I had a half-finished proposal for that proxy open on my Mac.

I wanted to say “go ahead and run the test” without wondering which of my personal files a script could reach. I still wanted to use the same laptop. With [VirtualBuddy](https://github.com/insidegui/VirtualBuddy), I could open an Ubuntu ARM64 desktop on my Mac and give the agent a Linux filesystem to work in. The proxy itself belonged on a separate Debian VM in the homelab. I’d use the Mac again later, this time as a client, to find out whether I could sign in through Caddy and open a Proxmox console.

```mermaid size=standard caption="VirtualBuddy let me work on the proposal on my laptop. Once Caddy was installed in the lab, I could close the development VM and still use the dashboard."
flowchart TB
    accTitle: Where I developed Caddy and where it ran
    accDescr: The Mac hosts VirtualBuddy and a browser. VirtualBuddy runs the Ubuntu development VM for Codex, review and isolated tests. Later the Mac browser opens the dashboard through Caddy in a separate Debian VM hosted by Proxmox.
    subgraph MAC["My Mac"]
        VB["VirtualBuddy"]
        DEV["Ubuntu development VM<br/>Codex, design review<br/>and tests"]
        BR("Mac browser")
        VB -->|hosts| DEV
        %% Keep the Mac's two roles in one column at phone widths.
        DEV ~~~ BR
    end
    subgraph LAB["Homelab · Proxmox host"]
        CADDY["Debian Caddy VM<br/>Private HTTPS<br/>reverse proxy"]
    end
    BR -->|Dashboard over HTTPS| CADDY

    class BR source;
    class VB,DEV,CADDY process;
```

My Ubuntu desktop was ready before my project was. I wanted to reopen the discussion, find the paragraph we’d been revising, and run the checks myself. A Git clone would bring back the committed files. I also needed the conversation and the documents it referred to.

## Bringing the conversations and their working files across

For Caddy, the repository held the configuration. In the local Homelab project I also had running notes from our discussions, a record of decisions we’d changed, the review findings, and the visual explainer I used to walk through the design. I wanted the latest handoff to open beside those files so I could see which questions were still open. I’d also spent about two months sketching out something else I want to build in the lab. A few of its earliest notes lived in that workspace too.

I restored the exported project folders on the VM, keeping the Mac export as a reference. Before repairing paths or rebuilding anything for Linux, I compared the restored files with the Mac inventory by size and SHA-256 hash. The export contained 79,041 files. I went back to a smaller set of 134 planning, review, explainer, and experiment files and checked them against the original again. Every one matched. I also verified the 69 exported attachments, images, and visualizations in the locations the app used on the VM.

Opening Codex on Linux gave me a different test. The chat history and archive flags had carried over, but some older conversations still referred to working folders by their Mac paths. I could read what an agent and I had decided even when its old folder name meant nothing on Linux. Fixing every historical chat would have been a project of its own. I picked the three I still needed and checked those first.

All three showed up in the app. From the implementation conversation, I asked the agent to send a short check to the planning conversation. It reached the existing chat, which replied from the VM. I could also read the recent history in the third chat. The message exchange tested continuity between two conversations. The file comparisons answered the question I cared about just as much: when I went back to the Caddy proposal, would the actual document still be there?

## What GitHub couldn’t give me back

A Git worktree lets me keep two branches open in different folders. I can leave a change half finished in one while I review another. That’s useful with agents, but it means the state of my work includes which branch each folder belongs to, which edits I’ve staged, and which files Git has never tracked.

I set up GitHub access separately on the VM and fetched the latest repository history. A fetch let me see what had changed upstream while leaving the files in front of me alone. My working branch was 14 commits behind the fetched main branch. I had 14 modified files and another eight untracked files. Five paths I needed to reconcile had changed upstream too.

Before cleaning up the old checkout, I archived those 22 files. Then I started from the original commit in a scratch directory and reconstructed the unfinished work. All 22 file hashes matched. If I’d missed an untracked file, this was where I wanted to find out, while I still had the original export.

With that check done, I could bring the main checkout up to date, retain the old branch, and reconcile overlapping edits in a separate worktree. I had a clean place to start the next change and a way back to exactly what I’d been working on.

## The files matched. Could I do any work?

The first validation run on Linux exposed a different set of problems. There were dependency caches from the previous environment, missing tools, and versions that disagreed with what the repository expected. A hash could tell me a cache had copied perfectly. It couldn’t make a macOS dependency usable on Ubuntu.

I rebuilt the development tools on the VM and ran the repository checks against actual changes I was reviewing. The Caddy documentation candidate passed the full local suite. That was a better test of the move than opening the files in an editor. I could pick up a change, inspect it, and validate it on the machine where I planned to keep working.

## How a change moves through review

With the tools working again, I could change how I worked with the agents. In Part 7 I wrote about keeping track of their decisions. On the VM I wanted to be able to point at a particular paragraph or line of code, ask for a change, and see what the implementor did about it.

One question in the Caddy proposal was who should be able to edit DNS. I used the grill-me skill to work through a browser visit and a certificate renewal. The process that renews the certificate needs the DNS credential. The process that serves the dashboard only needs to read the certificate and key. The implementor put that decision in the plan and used the visual explainer to show me what would run under each account.

Then a second agent read the proposal with Ponytail Review. It spotted an older set of instructions for installing the reload service alongside the ones we’d chosen. If I were following the guide on a new VM, either looked like a reasonable next command. The explainer also skipped what should happen the very first time, before Caddy had a certificate to serve. The reviewer sent both findings back to the implementor, who owned the edits.

I opened the review in Plannotator on the Ubuntu desktop. My first comment asked the reviewer to check the implementor’s newer revision. It went back to the files, confirmed that the competing example was gone, and checked that the explainer now showed the first startup. I approved that revision of the plan. I still had to decide when to start the service.

Later, when we had a release script to review, we tried two practices from Superpowers. First, give the script a failure case it ought to catch. Then run the checks against the exact revision I’m being asked to accept. The implementor ran the release check against disposable Git repositories on the VM. For that run we checked there were no Mac shares or forwarded credentials and that the guest-to-host socket was blocked. Now I could read the diff alongside the result and ask for a fix while everything was still on the development machine.

```mermaid size=standard caption="My first approval records the plan we agreed to. If I ask for a code change later, the implementor brings back the revised commit and fresh test results. I decide separately when to install it in the lab."
---
config:
  flowchart:
    padding: 7
    nodeSpacing: 14
    rankSpacing: 25
---
flowchart TB
    accTitle: How I take an agent-assisted change from a design question to approval
    accDescr: Grill-me clarifies the design question. The implementor drafts or revises the plan and an independent reviewer checks it with Ponytail Review. I comment on the plan in Plannotator and approve a specific revision. One implementor then edits the code, tests failure cases on the VM using Superpowers practices, and submits the exact commit and results for independent review. Findings return to the implementor. I review the tested change before approving it. Live deployment requires a separate decision.
    Q("Grill-me • Who needs<br/>permission to edit DNS?")
    PLAN["Implementor drafts<br/>or revises the plan"]
    PR["Ponytail Review<br/>Reviewer checks the design"]
    OWNER{"Plannotator<br/>Do I approve this plan?"}
    EDIT["Implementor edits<br/>one task worktree"]
    TEST["Superpowers practices<br/>Test the failure case on the VM"]
    CODE["Ponytail Review<br/>Check the commit and test results"]
    DECIDE{"Do I approve this<br/>tested revision?"}
    DONE(["I approve the exact commit"])
    Q --> PLAN --> PR --> OWNER
    OWNER -->|Request edits| PLAN
    OWNER -->|Approve plan| EDIT
    EDIT --> TEST --> CODE
    CODE -->|Finding| EDIT
    CODE -->|Ready for me| DECIDE
    DECIDE -->|Request edits| EDIT
    DECIDE -->|Approve| DONE

    class Q source;
    class PLAN,PR,EDIT,TEST,CODE process;
    class OWNER,DECIDE human;
    class DONE approved;
```

I could pick up the Caddy proposal where I’d left it, ask for a correction, and test the code without leaving the VM. In Part 12 I’ll follow the other half of the story. When I opened the Proxmox dashboard on my Mac, how did the browser find Caddy, and what happened between clicking the console button and seeing a guest’s login prompt?
