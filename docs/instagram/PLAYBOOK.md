# Instagram playbook — @sharpandlean

The goal is two things at once: reach (followers who trust the scores) and
clicks (people reading reviews on the site). Every post is built from a review
the site has already published, so Instagram never says something the site
doesn't. The account's angle is **"supplements, scored — we read the label, not
the marketing."** Nobody else in UK supplement content owns a 0–10 score with
sources behind it, and a score is easy to share and argue about in comments.

---

## 1. Profile setup (do once, about 20 minutes)

| Field | Set it to |
| --- | --- |
| Account type | Settings → Account type and tools → **Switch to professional account → Creator** (category *Health/beauty*). Auto-publishing needs a professional account. |
| Profile picture | `social/instagram/brand/profile-picture.jpg` (the four-square mark) |
| Name *(searchable, keep the keyword)* | `SharpAndLean \| Supplement Reviews UK` |
| Username | `sharpandlean` ✓ |
| Bio (132/150) | `Supplements, scored out of 10.`<br>`We read the label, not the marketing.`<br>`Method set by a clinical nutritionist · UK`<br>`New reviews weekly ↓` |
| Link | `https://sharpandlean.com/links` (the new link-in-bio page) |
| Contact button | Email: your editorial address |
| Highlights | `social/instagram/brand/highlight-*.jpg` → **Start here** (post 001), **Scores**, **GLP-1**, **Protein**, **Creatine**, **Ask Sumita** |

Also: add the phone number and turn on two-factor authentication. A hacked
account loses its posts and its followers at the same time.

---

## 2. The first nine posts

All slides are already rendered at `public/ig/<id>/` (1080 × 1350, 4:5), with
captions in `social/instagram/posts/<id>.md`. Post them in this order. The
profile grid shows the newest post first, so post 009 ends up in the top-left.

| # | Post | Format | Why it's in the first nine |
| --- | --- | --- | --- |
| 001 | How we score supplements | Carousel | Pin it. Tells new visitors what the account is. |
| 002 | ColonBroom GLP-1 Booster — 2.8 | Carousel | "Nature's Ozempic" is a high-search hook. |
| 003 | Creatine: 3 g, not the scoop | **Reel** (on camera) | Reels bring in new viewers; simple, useful, shareable. |
| 004 | "GLP-1" supplements, ranked | Carousel | The most saveable post. Pin it. |
| 005 | Myprotein Impact Creatine — 8.6 | Carousel | Shows the scores aren't all negative. |
| 006 | SodaMelt — 1.4 | Carousel | Low score with a clear reason gets comments. |
| 007 | Akkermansia: "GLP-1" on the box | **Reel** (faceless) | Pattern-break; a myth-buster format. |
| 008 | Kinetica Whey — 8.0 | Carousel | Gym and drug-tested audience. |
| 009 | Vitamin D3 — 7.4 | Carousel | Broad appeal, especially for a UK winter. |

**Pin** 001, 004 and the best-performing post after two weeks.

### Reel 003 — "Creatine: 3 g, not the scoop" (on camera, Sumita or Pankaj, 30–40 s)

Film vertically in daylight, holding a tub, with a kitchen scale in shot. Use
the 003 slides as overlay graphics or the cover.

1. **0–3 s, hook on screen:** "You're probably taking more creatine than the research used."
2. **3–12 s:** "This pouch says 100 servings from 500 g. That's a 5 g scoop, about 4.4 g of creatine."
3. **12–22 s:** "The research, and the claim printed on the label, are built on 3 g of creatine a day. That's about 3.4 g of powder." *(Show 3.4 g on the scale.)*
4. **22–30 s:** "Take 3 g a day and this pouch lasts about 147 days instead of 100. It works out to roughly 9p a day."
5. **30–35 s, CTA:** "We score every supplement out of 10. Full review in our bio."

Caption: use `social/instagram/posts/003-creatine-reel.md`, adding "Not for
under-18s, or anyone with kidney disease unless their doctor agrees."
Audio: the voice only, with trending audio at about 10% volume.

### Reel 007 — Akkermansia (faceless, about 20 s, made in Instagram's editor or CapCut)

Six text cards over a slow push-in on a capsule bottle, about 3 s each:

1. "“Increases GLP-1 production” — printed on the box."
2. "The human trial measured GLP-1."
3. "It found no effect."
4. "And the dose? About 100× below that trial."
5. "Similar spec, generic brand: $29.99. This one: $145 on subscription."
6. "Scored 4.0/10. Full review → link in bio."

Use the 007 cover slide as the Reel cover so it matches the grid.

---

## 3. Weekly rhythm (daily, automated)

| Day | What | How |
| --- | --- | --- |
| Mon–Sun, 18:20 UK | One carousel | Automatic, from the approved queue |
| Tue + Fri | One Reel | Manual: on-camera (Sumita/Pankaj) or faceless text-reel from a carousel |
| Daily | 3–5 Stories | Repost the day's carousel with a poll ("Would you buy this? Yes/No") and the link sticker to the review |
| Daily, 15 min | Engagement | Reply to every comment within the first hour; leave useful comments on 10 UK fitness or nutrition accounts |

**What to post more of:** watch **saves and shares per reach**, not likes.
Saves mean "useful", and shares bring new followers. After 2–3 weeks, make more
of whatever topic scores best on that.

**Collaborations:** Instagram's *Collab* post feature puts one post on two
profiles. Offer UK PTs and dietitians a co-authored "we scored your
clients' favourite supplement" carousel. It's the fastest legitimate way to
grow a small account.

---

## 4. How the automation works

```
lib/articles/*.ts ──► npm run ig:build ──► public/ig/<id>/01..07.jpg   (slides, served by the site)
                                     └──► social/instagram/posts/<id>.md   (caption, editable)
social/instagram/queue.json  ← order + status (draft / approved / published / manual)
npm run ig:publish ──► Instagram Graph API ──► marks the post "published" ──► /links updates
```

* **A new review becomes a post automatically.** The daily GitHub Action
  (`.github/workflows/instagram.yml`, shipped as `docs/instagram/instagram.workflow.yml`) runs `ig:build --sync`. That queues every
  article not yet in the queue as a **draft** and renders its slides.
* **Nothing goes out without approval.** Change `"status": "draft"` to
  `"approved"` in `queue.json`, either on GitHub's web editor (works on a
  phone) or with `npm run ig:build -- --approve 002-colonbroom-glp-1-booster`.
  You can also edit the caption `.md` first and add a custom `"hook"`.
* **One post per day.** The publisher posts the first approved carousel whose
  slides are live on the site. Reels are `"manual"` and are skipped.

### Commands

```bash
npm run ig:build                       # render anything not yet rendered
npm run ig:build -- --sync             # + queue new articles as drafts
npm run ig:build -- --add calocurb-review --hook "Your hook here"
npm run ig:build -- --only 006-sodamelt --force   # re-render one post (overwrites its caption)
npm run ig:publish -- --dry-run        # show the next post without publishing
npx tsx scripts/instagram/brand.ts     # re-render profile picture and highlight covers
```

### Connecting the API (once)

0. Move `docs/instagram/instagram.workflow.yml` to `.github/workflows/instagram.yml`.
   It couldn't be written there directly, because that folder is protected from remote edits.
1. Switch the account to **Creator** (section 1).
2. Go to developers.facebook.com → **Create app** → add the **Instagram** product →
   *API setup with Instagram login*. Add @sharpandlean as a tester, accept the
   invite in the Instagram app, then generate a token with
   `instagram_business_basic` and `instagram_business_content_publish`.
3. Copy the **Instagram user ID** and the **long-lived token**.
4. In GitHub → repo Settings → Secrets and variables → Actions, add
   `IG_USER_ID` and `IG_ACCESS_TOKEN`.
5. Run the workflow once by hand (Actions → Instagram → *Run workflow*) with one
   post approved.

Long-lived tokens expire after 60 days. Once a month, run
`npm run ig:publish -- --refresh-token` locally with the current token in your
environment, then paste the new token into the GitHub secret. (This is worth
automating later with N8n, which already sits in your stack.)

If the Action can't push because `main` is protected, allow
`github-actions[bot]` to bypass the rule, or point the workflow at a branch.

---

## 5. Rules for every post

* Scores, prices and claims come only from the review file. If a review
  changes, re-render that post with `--only <id> --force`.
* Every caption keeps the "Not medical advice" line and the commission
  disclosure. Under the CMA and ASA rules, a post that includes an affiliate link
  or gifted product must also start with **#ad**. Today's posts send people to
  the site rather than to a retailer, so the site's own disclosure covers them.
* Never present a supplement as a substitute for a GLP-1 medicine. The ranking
  post says this explicitly; keep it that way.
