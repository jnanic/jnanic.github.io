---
title: "Building My Proxmox Homelab, Part 7: Keeping Track of the Agents"
description: "How repository memory, bounded delegation, and human review kept AI-assisted homelab work understandable across sessions."
publishedDate: "2026-10-02"
draft: false
tags:
- Homelab
- Proxmox
- Automation
- AI Agents
- Documentation
---

<img src="/blog/ai-agent-independent-verification-part7.png" alt="Obama awards himself a medal. The recipient is labeled ‘The AI agent that wrote the code’; the presenter is labeled ‘The AI agent reviewing the code’. Caption: ‘Independent verification complete’." width="500" style="max-width:100%">

During the first Homelable deployment, both containers were healthy. The automation still stopped.

As I covered in [Part 6](/blog/building-my-homelab-part6/), the auditor disagreed with how Docker represented a mount and named container capabilities. Fixing that required more than remembering that “the deployment failed.” We needed the revision that created it, the checks that passed, the checks that failed, and the state we had deliberately left behind.

That information went into a checkpoint in the repository. When work resumed, the next step was to correct the audit and inspect the retained deployment. It was not to delete everything and try again.

This became a recurring part of building the homelab with AI. Writing code was one part of the work. Keeping decisions, implementation, and live evidence aligned across sessions took its own process.

## I wanted to remain involved

I use AI tools extensively for research, implementation, debugging, and documentation. I also wanted this project to teach me something.

Letting an agent produce a large change and then approving it because the explanation sounded convincing would have defeated that purpose. I wanted to read the code, understand what it would change, run the relevant checks, and interpret the result.

The patch workflow helped enforce that habit. The agent prepared a change; I reviewed and applied it in my checkout, ran validation, and handled the commit and push. We then continued from the resulting revision.

That added friction. Sometimes I was reading a patch when I would rather have been trying the new service. But it gave me a reason to ask why a script needed a privilege, why a cleanup operation selected a particular resource, or what a passing test actually established.

I could still misunderstand something. Human approval only helps when there is something concrete to review and the person approving it pays attention.

## Giving the project a memory

A long conversation contains proposals, corrections, abandoned approaches, and statements that were true several weeks ago. I needed a way to resume work without treating all of those as current instructions.

The repository documents had different jobs:

| Document | What it answered |
| --- | --- |
| `AGENTS.md` | How should an agent work in this repository? |
| Architecture decision records | Why did I choose this design, and what would justify changing it? |
| Configuration and scripts | What behavior am I trying to deploy? |
| Dated checkpoints | What did I actually verify, and what remains unresolved? |
| Runbooks | How do I carry out or recover an operation? |
| Issues | What work is still actionable? |

Those distinctions helped when the records disagreed. A configuration file described the intended state. A checkpoint recorded an observation at a particular time. Neither automatically proved what was running now.

The checkpoints used explicit statuses such as “Validated,” “Configured but not retested,” “Planned,” and “Deferred.” A script could exist and pass local tests while its live behavior remained unverified.

For the failed Homelable apply, the checkpoint recorded healthy containers alongside the audit failure. It also listed everything we had not tested yet: login, restart behavior, repeat application, backup, and recovery.

That made the stopping point useful. The next session had a defined starting state and a list of claims it still needed to establish.

```mermaid size=standard caption="Repository memory narrows the next question; fresh evidence establishes the current state."
flowchart TB
    accTitle: Resuming work from repository memory and current evidence
    accDescr: Repository instructions and reusable skills, architecture decisions and desired configuration, and dated checkpoints and open issues are read together. Fresh read-only evidence is collected from the current target. A human reconciles intended, recorded, and observed state before approving a bounded next task. If a discrepancy remains unresolved, progression stops and the discrepancy is recorded; an old checkpoint never proves current live state.

    RULES("Repository instructions<br/>and reusable skills")
    DECISIONS("ADRs and desired<br/>configuration")
    RECORDS("Dated checkpoints<br/>and open issues")
    TARGET("Current target<br/>or environment")
    READ["Read and reconcile<br/>repository context"]
    OBSERVE["Collect fresh<br/>read-only evidence"]
    LIVE[["Current observations"]]
    RECONCILE["Compare intended,<br/>recorded, and observed state"]
    GATE{"Conflict resolved<br/>and next task bounded?"}
    STOP{{"Stop progression<br/>record discrepancy"}}
    NEXT(["Bounded next task<br/>approved"])

    RULES --> READ
    DECISIONS --> READ
    RECORDS --> READ
    TARGET --> OBSERVE --> LIVE
    READ --> RECONCILE
    LIVE --> RECONCILE
    RECONCILE --> GATE
    GATE -->|"Yes"| NEXT
    GATE -->|"No"| STOP

    class RULES,DECISIONS,RECORDS,TARGET source;
    class READ,OBSERVE,RECONCILE process;
    class LIVE evidence;
    class GATE human;
    class STOP failure;
    class NEXT approved;
```

## Recording why a decision changed

The move from disposable guests to a persistent integration host needed more than an updated VM diagram.

The original design had proved useful isolation and cleanup behavior. It also required too much machine setup for every application test. I wanted to preserve both findings.

The replacement architecture decision recorded the failed attempt, explained the new lifecycle boundary, and identified which parts of the earlier decision remained valid. Production isolation and separate identities still applied. Recreating the entire guest for each workload did not.

It also recorded the new costs: a retained host could accumulate drift, and a baseline snapshot did not establish recovery after total host loss.

Without that reasoning, a later agent could reasonably suggest disposable guests again. The decision record gave it the evidence behind the choice, including conditions under which we should reconsider it.

## Turning repeated instructions into skills

Some instructions kept coming back.

For repository changes, I wanted a branch name, a complete patch, an application check, validation results, and commit and PR text. I did not want to discover halfway through applying a change that a new file had been omitted.

I captured that process in a reusable patch-handoff skill. The handoff included checking the patch against its expected base revision and distinguishing completed validation from checks I still needed to run.

Later, the blog acquired its own repeated requirements. Mermaid diagrams needed consistent colors and shapes, accessible descriptions, readable mobile sizing, and arrows that represented the actual process. Those became another skill, shared by the homelab and website tasks.

I kept repository-specific operating rules in the repository and reusable procedures in skills. That reduced how much I had to repeat in each prompt, although the instructions still needed maintenance when the workflow changed.

## Delegating work with a defined boundary

I used subagents for bounded investigations and separate tasks for work with a different context, such as the website.

A useful assignment named the question, the relevant evidence, and the expected result. “Investigate this network boundary and report the constraints” was easier to evaluate than asking another agent to improve the whole design.

The parent task still had to reconcile the findings. Two agents agreeing did not establish that a configuration worked. Their conclusions needed to survive review and, where appropriate, a live test.

The blog work gave me a practical example of coordination between tasks. This homelab task held the engineering history; the Website task held the rendering implementation. I could approve a diagram here, pass a scoped implementation request across, and review the result in the local website.

That separation was useful, but it created another handoff to manage. The receiving task needed the relevant decision and constraints, not an assumption that it knew everything from the other conversation.

## Making completion mean something specific

I tried to keep the work small enough that I could explain what the next step would prove.

For infrastructure changes, that meant a bounded change followed by evidence before advancing. Commands identified where they ran and whether they changed state. A failed operation became a recorded stopping point.

The checks also had different limits. Local tests could establish how a parser handled a fixture. Controller validation could establish whether the tooling worked in its execution environment. Integration could exercise application behavior. Production still needed its own acceptance checks.

The same distinction applied to backups. Creating an archive, inspecting it, and starting an isolated restore were separate results. The documentation needed to say which had happened.

This took more effort than marking a task complete when the command exited successfully. It also made it easier to resume after a failure without accidentally upgrading an assumption into a fact.

```mermaid size=standard caption="Completion follows scoped evidence; production acceptance remains a separate decision when relevant."
flowchart TB
    accTitle: Bounded agent work and evidence-based completion
    accDescr: A scoped task goes to an agent for investigation and a proposed patch. An optional bounded subagent returns findings to the parent agent, and neither has autonomous production authority. A human either requests revision or approves an operator-applied bounded change. Validation produces recorded evidence for a second human decision. Unmet criteria record a failure or open gap and guide correction; accepted scoped evidence creates the next checkpoint without implying production acceptance.
%% panel AGENTWORK "Bounded agent work": AGENT,SUB,DENIED

    TASK("Scoped task<br/>question, evidence,<br/>expected result")
    AGENT["Investigate and<br/>propose patch"]
    SUB["Optional bounded<br/>subagent investigation"]
    DENIED{{"Autonomous production<br/>authority denied"}}
    REVIEW{"Patch understood<br/>and approved?"}
    APPLY["Operator applies<br/>bounded change"]
    VALIDATE["Run checks appropriate<br/>to the changed layer"]
    EVIDENCE[["Validation evidence<br/>recorded"]]
    COMPLETE{"Completion criteria met?"}
    GAP{{"Failure or open gap<br/>recorded"}}
    REVISE["Revise scope, patch,<br/>or validation"]
    CHECKPOINT(["Accepted outcome<br/>next checkpoint recorded"])

    TASK --> AGENT
    AGENT -.->|"Optional scoped question"| SUB
    SUB -->|"Findings only"| AGENT
    AGENT -.->|"No production authority"| DENIED
    SUB -.->|"No production authority"| DENIED
    AGENT --> REVIEW
    REVIEW -->|"Needs revision"| REVISE
    REVIEW -->|"Approved"| APPLY --> VALIDATE --> EVIDENCE --> COMPLETE
    COMPLETE -->|"No"| GAP --> REVISE
    REVISE -->|"Return to agent work"| AGENT
    COMPLETE -->|"Yes"| CHECKPOINT

    class TASK source;
    class AGENT,SUB,APPLY,VALIDATE,REVISE process;
    class DENIED failure;
    class REVIEW,COMPLETE human;
    class EVIDENCE evidence;
    class GAP warning;
    class CHECKPOINT approved;
```

## Where the process became too heavy

The disposable integration workflow was the clearest example. We built substantial machinery around qualifying and removing a guest before the application had even started. I changed the design when the coordination cost became hard to justify.

The diagrams were a smaller version of the same problem. Achieving consistent styling and readable layouts led to renderer changes, authoring conventions, and repeated fixes around subgraphs.

These were reminders to review the process as critically as the code it produced.

## Coming next

The repository now carries the decisions, operating instructions, and verified stopping points needed to continue the project. I still review changes and test the resulting systems; the documents help me work out where to start and what remains uncertain.

The next post returns to the network upgrade: separating the homelab into networks, moving services across them, and checking which connections should still work afterward.
