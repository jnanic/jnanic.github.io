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

I was reviewing the Caddy proposal on my Mac when I started thinking about where the agent would run its tests. The proposal was for the staging proxy from [Part 10’s maps](/blog/building-my-homelab-part10/). I wanted to be able to say “go ahead and run the test” without having to think through which of my personal files the script could reach.

I still wanted to work from the same laptop, so I used [VirtualBuddy](https://github.com/insidegui/VirtualBuddy) to run an Ubuntu ARM64 VM on my Mac. The agent would have a Linux filesystem of its own for the review and tests. Caddy would run on a separate Debian VM in the lab. With Ubuntu running, I needed to bring over the half-finished proposal and all the work around it.

```mermaid size=standard caption="Once Caddy was running in the lab, I could close the Ubuntu VM and still use the dashboard from my Mac."
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

My Ubuntu desktop was ready before my project was. I wanted to reopen the discussion and find the paragraph we’d been revising. A Git clone would bring back the committed files. I also needed the conversation and the documents it referred to.

## Moving the project and its chats

The Git repository held the Caddy configuration. The local Homelab project had the running notes, review findings, decisions we’d changed, and the visual explainer I used to walk through the design. I wanted to open the latest handoff beside those files and see which questions were still open. I’d also spent about two months sketching another lab project. Some of its first notes were in that workspace.

I restored the 79,041-file export and compared the restored files with the Mac inventory by size and SHA-256 hash. All 134 files I rechecked matched, and I verified all 69 attachments and visualizations where Codex expected them. Chat history and archive flags came across too. Some older chats still pointed to Mac folders, so I checked the three I needed. The implementation chat sent a test message to the planning chat and got a reply on the VM. I could read the history in the third.

## What GitHub couldn’t give me back

A Git worktree lets me keep two branches open in different folders. I can leave a change half finished in one while I review another. To move that work, I needed to know which branch each folder belonged to, which edits I’d staged, and which files Git had never tracked.

On the VM, I set up GitHub access and fetched the latest history. My branch was 14 commits behind main. I had 14 modified files and eight untracked ones, and five of those paths had also changed upstream.

Before cleaning up the old checkout, I archived those 22 files. In a scratch directory, I started from the original commit and reconstructed the unfinished work. All 22 file hashes matched. Then I updated main, kept the old branch, and reconciled the overlapping edits in a separate worktree.

## Running the checks on Linux

My first validation run hit missing tools, mismatched versions, and dependency caches from the Mac. I rebuilt the development tools on Ubuntu and ran the full local suite against the Caddy documentation changes. It passed.

## How a change moves through review

In [Part 7](/blog/building-my-homelab-part7/) I wrote about keeping track of the agents’ decisions. On the VM, I wanted to point to a particular line in a plan or a script, ask for a fix, and see what changed.

One question in the Caddy proposal was who should be able to edit DNS. I used the [grill-me skill](https://github.com/mattpocock/skills/blob/main/skills/productivity/grill-me/SKILL.md) to work through a browser visit and a certificate renewal. The renewal process needs the DNS credential. Caddy only needs to read the certificate and key to serve the dashboard. The implementor recorded that decision in the plan and used [Visual Explainer](https://github.com/nicobailon/visual-explainer) to show which account ran each process.

A second agent used [Ponytail Review](https://github.com/DietrichGebert/ponytail/blob/main/skills/ponytail-review/SKILL.md) to check the proposal. It found two sets of instructions for installing the reload service. Both looked like something I could follow on a fresh VM, even though one was obsolete. The explainer also skipped the first startup, when Caddy would have no certificate to serve. The reviewer sent both findings to the implementor.

When I agree with a finding, I send it back to the implementor and have the reviewer check the revised plan. Once the reviewer clears a draft, I use [Plannotator](https://github.com/backnotprop/plannotator) to approve that revision or ask for another change. For Caddy, I asked the reviewer to check the newer revision. It confirmed that the old instructions were gone and the explainer now showed the first startup. I approved that plan in Plannotator. I still had to decide when to start the service.

Later, we tried two practices from [Superpowers](https://github.com/obra/superpowers) on a release script. The implementor gave the script a failure case to catch in disposable Git repositories and ran the checks against the exact revision I’d review. We checked that the VM had no Mac shares or forwarded credentials and that the guest-to-host socket was blocked for that run. I could read the diff alongside the test results and ask for a fix from the VM.

```mermaid size=standard caption="I approve a specific plan or tested commit. Deciding when to install the change in the lab comes later."
---
config:
  flowchart:
    padding: 7
    nodeSpacing: 14
    rankSpacing: 25
---
flowchart TB
    accTitle: How I take an agent-assisted change from a design question to approval
    accDescr: Grill-me clarifies the design question. The implementor drafts the plan and an independent reviewer checks it with Ponytail Review. If I agree with a finding, I send the plan back to the implementor for revision and the reviewer checks it again. The cleared plan reaches Plannotator, where I can approve that revision or request more edits. One implementor then edits the code, tests failure cases on the VM using Superpowers practices, and submits the exact commit and results for independent review. Findings return to the implementor. I review the tested change before approving it. Live deployment requires a separate decision.
    Q("Grill-me • Who needs<br/>permission to edit DNS?")
    PLAN["Implementor drafts<br/>or revises the plan"]
    PR["Ponytail Review<br/>Reviewer checks the plan"]
    OWNER{"Plannotator<br/>Do I approve this plan?"}
    EDIT["Implementor edits<br/>one task worktree"]
    TEST["Superpowers practices<br/>Test the failure case on the VM"]
    CODE["Ponytail Review<br/>Check the commit and test results"]
    DECIDE{"Do I approve this<br/>tested revision?"}
    DONE(["I approve the exact commit"])
    Q --> PLAN --> PR
    PR -->|I agree with a finding| PLAN
    PR -->|Reviewer clears plan| OWNER
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

## Where Part 11 ends

I picked up the Caddy review on Ubuntu with the proposal, its comments, and my unfinished Git work at hand. I could ask for a fix, check the new revision, and run the repository suite from the VM. I kept the Mac export and the old branch in case I needed to recover an edit. By the time I approved the revised plan, I also had a clean worktree for the next change.

## Coming next

The proxy still had to work on its Debian VM in the lab. In Part 12 I’ll start at my Mac’s address bar and follow both HTTPS connections, from my browser to Caddy and from Caddy to Proxmox. I’ll sign in and check that the guest console stays connected. I’ll also try the direct route back into Proxmox with Caddy stopped.
