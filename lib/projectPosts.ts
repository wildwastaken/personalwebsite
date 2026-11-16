// Longer write-ups for the bigger projects, shown at /projects/[slug].

export interface PostFigure {
  src: string
  alt: string
  caption?: string
}

export interface PostSection {
  heading: string
  paragraphs: string[]
  bullets?: string[]
  /** Screenshots. Phone-shaped ones (taller than wide) sit side by side. */
  figures?: PostFigure[]
  code?: { lang: string; caption?: string; text: string }
  /** A small horizontal bar chart. value is 0..1. */
  bars?: { caption: string; rows: { label: string; value: number; display: string }[] }
  /** A named custom illustration, rendered by the page. */
  diagram?: 'thesis-pipeline'
}

export interface ProjectPost {
  slug: string
  title: string
  subtitle: string
  meta: string
  /** A few headline numbers shown under the title. */
  facts?: { value: string; label: string }[]
  sections: PostSection[]
  links?: { label: string; href: string }[]
}

export const projectPosts: ProjectPost[] = [
  {
    slug: 'thesis',
    title: 'What Survives the Clip?',
    subtitle: 'Which moments of long-form podcasts get clipped into TikToks, and which of those clips take off.',
    meta: 'Senior thesis · Princeton · advised by Manoel Horta Ribeiro · in progress',
    facts: [
      { value: '~32M', label: 'TikToks in the research corpus' },
      { value: '84k', label: 'podcast episodes searched' },
      { value: '796k', label: 'passages in the study corpus' },
      { value: '11×', label: 'cheaper per clip after tuning' },
    ],
    sections: [
      {
        heading: 'The question',
        paragraphs: [
          'A lot of people never listen to a full episode of the big podcasts. They see a minute of it on TikTok. So whoever cuts the clips decides what most people think a show is about, and the platform then decides which of those clips get seen.',
          'My thesis splits that into two questions. Selection: out of a three-hour episode, which moments get clipped? Amplification: once something is clipped, what predicts whether it actually spreads?',
        ],
      },
      {
        heading: 'The data',
        paragraphs: [
          'On the TikTok side there’s a research corpus of about 32 million videos, roughly 3% of what was posted in the US from early 2025 through mid 2026, with engagement data. On the podcast side I search a Princeton corpus of 84,000 episodes, and the study itself uses 16 shows (Rogan, Theo Von, Tucker, Shapiro, Call Her Daddy, The Daily and others): 9,483 episodes from July 2024 to September 2025, cut into 796,259 overlapping passages.',
          'Everything is speech, so the first step is speech-to-text over all of it with Whisper, run as batch jobs on Princeton’s research cluster.',
        ],
      },
      {
        heading: 'Why matching is hard',
        paragraphs: [
          'You’d think finding where a clip came from is just a text search. It isn’t:',
        ],
        bullets: [
          'Clips are cut mid-sentence, sped up, captioned and talked over by whoever reposted them.',
          'Speech-to-text gets the same words wrong in different ways each time, especially names.',
          'A lot of audio isn’t unique. Every political show replays the same debate answer or hearing exchange, so a perfect text match can point at the wrong source.',
          'The published audio drifts: ads get inserted after the fact (a minute on median, up to nine), so timestamps don’t line up.',
          'And it has to run on millions of clips against hundreds of thousands of passages, so anything that compares every clip to everything is out.',
        ],
      },
      {
        heading: 'How the matcher works',
        paragraphs: [
          'It works in two stages. First, each clip is split into overlapping 80-word windows, and for each window I look up its 12 rarest words and its 12 rarest three-character fragments in an index of every passage. Rare words are what make a passage identifiable, and the fragments still line up when a name is misheard. Each lookup keeps its top 60 passages, which comes to about 290 candidates per clip instead of hundreds of thousands.',
          'Second, every candidate gets fuzzy-aligned against the clip to find the exact span and score it on similarity, length and whether the words come in the same order. A match needs a run of at least 12 words in a row. Replayed audio is its own category: when the best match is a debate or hearing that lots of shows aired, it gets labeled as shared audio, not as a clip of that show.',
        ],
        diagram: 'thesis-pipeline',
        code: {
          lang: "python",
          caption: "simplified sketch of the two stages",
          text: "\n# Stage 1: each 80-word window looks up only its rarest features.\ndef candidates(window, index, limit=60):\n    words = sorted(set(window.words), key=index.doc_freq)[:12]\n    grams = sorted(set(char_trigrams(window.text)), key=index.doc_freq)[:12]\n    found = set()\n    for feats in (words, grams):\n        # passage score = sum of log((P + 1) / (df + 1)) over the features it contains\n        found |= index.top_passages(feats, k=limit)\n    return found                      # ~290 per clip instead of millions\n\n# Stage 2: fuzzy-align each candidate to find the exact span.\ndef rank(clip, passages):\n    for p in passages:\n        a = partial_ratio_alignment(clip.text, p.text)        # RapidFuzz\n        length = min(a.aligned_words / 30, 1)\n        yield p.episode, a.span, a.similarity * length * word_order(clip, p, a)\n",
        },
      },
      {
        heading: 'Making it fast',
        paragraphs: [
          'At the original settings, matching all 32 million TikToks would have cost around 30,000 CPU-hours. Profiling showed most of the time wasn’t the alignment at all but reading lookup lists, so I rewrote that part (an in-memory index, smarter lookups) with output checked to be identical, and then tuned how many candidates to keep. Per clip it went from 3.01 to 0.27 CPU-seconds.',
          'The catch is that the cheapest settings aren’t lossless on random TikToks, even though they were on the clean test clips. So the latest round is a 600-job grid (three lookup types × five corpus sizes × eight candidate limits, about 640 CPU-hours) to pick the setting with the best accuracy for the cost.',
        ],
        bars: {
          caption: "CPU-seconds per clip against the full corpus, all 6,223 test TikToks",
          rows: [
            { label: "original", value: 1.0, display: "3.01 s" },
            { label: "tuned", value: 0.09, display: "0.27 s" },
          ],
        },
      },
      {
        heading: 'Checking it',
        paragraphs: [
          'Accuracy comes from hand labels: a review page that plays the TikTok and the matched podcast moment side by side, with 136 decisions so far. An LLM pre-screens candidates by reading both transcripts, and when I checked its calls by listening I agreed with it 68 times out of 69, which makes labeling at scale realistic. On clips we know the answer to, the right episode comes out on top every time; on random TikToks the recall question is what the grid is for.',
        ],
        bars: {
          caption: "Recall against a top-100 reference on 6,223 random TikToks, by how many passages each clip gets compared to",
          rows: [
            { label: "~10 compared", value: 0.633, display: "0.63" },
            { label: "~50", value: 0.886, display: "0.89" },
            { label: "~100", value: 0.946, display: "0.95" },
            { label: "~150", value: 0.963, display: "0.96" },
            { label: "~300 (default)", value: 0.98, display: "0.98" },
          ],
        },
      },
      {
        heading: 'What’s next',
        paragraphs: [
          'With matches in hand, each episode gets cut into clip-length segments and labeled for things like conflict, humor, emotion, certainty and how quotable a line is. Comparing a clipped moment with the unclipped moments right around it in the same episode controls for the show and the topic, which is what makes the selection question answerable. Then engagement on the clips, controlling for creator and upload age, gets at what actually spreads.',
        ],
      },
    ],
  },
  {
    slug: 'called-it',
    title: 'Called It',
    subtitle: 'Who actually called 2024? Podcast predictions, graded against Polymarket and Kalshi.',
    meta: 'Side project · 2026 · built on transcripts from my thesis corpus',
    facts: [
      { value: '559', label: 'predictions extracted' },
      { value: '18.9k', label: 'settled markets indexed' },
      { value: '127', label: 'graded calls' },
      { value: '76%', label: 'came true' },
    ],
    sections: [
      {
        heading: 'Why',
        paragraphs: [
          'I had a few thousand 2024 podcast transcripts sitting around from my thesis, and 2024 was an election year, so the shows were full of “mark my words” moments. Prediction markets give a clean answer key: what actually happened, and what the crowd thought on the day someone said it. So I graded the podcasts.',
        ],
        figures: [
          { src: '/images/projects/called-it/leaderboard.webp', alt: "Called It leaderboard of podcasts with hit rates and Brier scores", caption: "The leaderboard: hit rate with a 95% interval, and Brier score against the market." },
        ],
      },
      {
        heading: 'How it works',
        paragraphs: [
          'A cheap regex pass finds forecast language (“is going to win”, “I’d bet”, “no way he…”) and cuts a short window around each hit: 8,392 windows across 3,217 episodes. I sampled about a thousand of those across shows and months, and an LLM turned each window into structured claims: the quote, a clean proposition like “Republicans win the Senate,” which way the speaker leaned, and how confident they sounded. Claims whose quote couldn’t be found in the source text got thrown out.',
          'On the market side I indexed about 18,900 settled markets from Polymarket and Kalshi, with daily price history. Each claim gets matched to candidate markets by text search, then an LLM confirms the match and, importantly, which side of the market the claim is on.',
          'Scoring uses the Brier score: the show’s implied confidence against the outcome, compared with the market price on the day the episode aired. Each show’s first call on a given market counts once, so a show repeating “Trump wins” forty times doesn’t get forty points.',
        ],
        code: {
          lang: "python",
          caption: "pipeline/scorecard/scoring.py",
          text: "\nCONFIDENCE_PROB = {\"certain\": 0.9, \"likely\": 0.8, \"lean\": 0.65}\n\ndef speaker_prob(confidence: str, stated: float | None) -> float:\n    \"\"\"Probability the speaker put on their own side of the claim.\"\"\"\n    if stated is not None and 0 < stated < 1:\n        # A stated number is for their side; clamp so \"100%\" doesn't give a perfect Brier.\n        return min(max(stated, 0.5), 0.99)\n    return CONFIDENCE_PROB.get(confidence, 0.75)\n\ndef brier(p: float, outcome: bool) -> float:\n    return (p - (1.0 if outcome else 0.0)) ** 2\n",
        },
      },
      {
        heading: 'What came out',
        paragraphs: [
          'Out of 127 graded calls the shows were right 76% of the time, but on average a bit worse calibrated than the markets (0.19 vs 0.16, lower is better). The best single call: Clay & Buck saying in June it was “laughable” to think Biden wouldn’t pardon Hunter, when the market had it at 14%. One of the worst: Glenn Beck backing Michelle Obama as the Democratic nominee in January, at 4%.',
          'The honest read is that most of the “skill” is just which way a show leaned on one very correlated election, and every show’s confidence interval overlaps the others.',
        ],
        figures: [
          { src: '/images/projects/called-it/claims.webp', alt: "Grid of graded prediction cards with quotes, verdicts and market odds", caption: "Every graded call, with the quote, the clean proposition and the market price that day." },
          { src: '/images/projects/called-it/detail.webp', alt: "Detail view of one prediction with the market price chart", caption: "One call up close: the quote, the market it matched and how the odds moved." },
        ],
      },
      {
        heading: 'Where it’s shaky',
        paragraphs: ['I spot-checked everything by reading the source text, and fixed what I found. What’s left:'],
        bullets: [
          'About 90% of extracted claims are real predictions; the rest are things like a host reading betting odds aloud.',
          'Market matching was right 116 times out of 120 in spot checks, after fixing a bug where “X wins” and “X does not win” got merged.',
          'The transcripts don’t say who’s talking, so a guest’s prediction counts for the show.',
          'Speech-to-text mangles names, and confidence is inferred from wording, which moves the Brier numbers (but not the hit rates).',
        ],
      },
    ],
    links: [
      { label: 'See the scorecard', href: 'https://allenliu.dev/calledit' },
      { label: 'Code', href: 'https://github.com/wildwastaken/called-it' },
    ],
  },
  {
    slug: 'hardcover-wrapped',
    title: 'Hardcover Wrapped',
    subtitle: 'A Spotify-Wrapped-style recap of your reading year, for anyone on Hardcover.',
    meta: 'Side project · 2025',
    facts: [
      { value: '10', label: 'cards in the story' },
      { value: '0', label: 'tokens stored on the server' },
    ],
    sections: [
      {
        heading: 'Why',
        paragraphs: [
          'I track my books on Hardcover. Every December everyone posts their Spotify Wrapped, and I wanted the same thing for reading, something anyone on Hardcover could use and not just me.',
        ],
      },
      {
        heading: 'Handling the token',
        paragraphs: [
          'You connect with your Hardcover API key, so the design is about treating it carefully: it stays in your browser (only for the tab, unless you tick “remember”), it’s sent in the body of one request rather than a URL, the server forwards it to Hardcover for that request and never logs or stores it, and you can disconnect at any time. Results are cached for two minutes under a hash of the key, so flipping between years doesn’t hammer Hardcover’s API.',
          'No key? “Try it with mine” loads my own shelf instead. This site fetches it with my token on its server and hands Wrapped only the books, so my key never goes near the browser.',
        ],

        code: {
          lang: "ts",
          caption: "lib/hardcover.ts",
          text: "\n// Short in-memory cache so stepping between years does not re-query Hardcover.\n// Keyed by a hash of the token; the token itself is never stored or logged.\nconst TTL_MS = 2 * 60 * 1000\nconst keyFor = (token: string) => createHash('sha256').update(token).digest('hex')\n\nexport async function fetchReadBooks(token: string): Promise<unknown> {\n  const key = keyFor(token)\n  const hit = cache.get(key)\n  if (hit && Date.now() - hit.at < TTL_MS) return hit.body\n  // ...one read-only GraphQL query to Hardcover...\n}\n",
        },
      },
      {
        heading: 'The story',
        paragraphs: [
          'One GraphQL query pulls every book you’ve marked as read with its finish dates, pages, authors, ratings, tags and cover. From that it builds a tap-through story: books finished, pages turned (compared to a famous long book), your busiest month, top author and genre, longest and shortest, five-star picks, and the first and last book of the year. Cards without enough data just get skipped.',
          'The last card is a summary you can download as an image. Covers come from other domains and would break the export, so the image draws little book spines in each cover’s color instead.',
        ],
        figures: [
          { src: '/images/projects/hardcover-wrapped/books.webp', alt: "Wrapped card: books finished this year", caption: "Books finished" },
          { src: '/images/projects/hardcover-wrapped/month.webp', alt: "Wrapped card: busiest month bar chart", caption: "Busiest month" },
          { src: '/images/projects/hardcover-wrapped/five-stars.webp', alt: "Wrapped card: five-star books with covers", caption: "Five stars" },
          { src: '/images/projects/hardcover-wrapped/summary.webp', alt: "Wrapped summary card with download button", caption: "The shareable summary" },
        ],
      },
      {
        heading: 'Edge cases that mattered',
        paragraphs: [
          'Rereads (a book finished twice in a year counts as one book but two reads), books you’re rereading right now, books with no page count, years with nothing finished, and expired keys all get their own handling, and there are tests for each.',
        ],
      },
    ],
    links: [
      { label: 'Try it', href: 'https://allenliu.dev/wrapped' },
      { label: 'Code', href: 'https://github.com/wildwastaken/hardcover-wrapped' },
    ],
  },
  {
    slug: 'cook-split',
    title: 'Cook Split',
    subtitle: 'Scale the recipes, merge the grocery list, split the bill. For when six people cook dinner together.',
    meta: 'Side project · 2025',
    facts: [
      { value: '57', label: 'tests' },
      { value: '0', label: 'servers: the share link carries everything' },
    ],
    sections: [
      {
        heading: 'Why',
        paragraphs: [
          'My friends and I cook together a lot, and every time it’s the same mess: someone scales a recipe in their head, two people buy garlic, and the Venmo math happens three days later in a group chat. This does all of it in one place.',
        ],
      },
      {
        heading: 'Recipes to one grocery list',
        paragraphs: [
          'You pick from recipes we’ve made before (or paste a new one) and set how many people are eating. Every ingredient line gets parsed: fractions like 1 ½, ranges, can sizes like “1 (28 oz) can”, and “to taste”. Then everything is scaled to the headcount and merged across recipes, so garlic from the pasta and garlic from the stir-fry become one line, rounded up to amounts you can actually buy and grouped by store section. It never converts cups into ounces, because guessing the weight of a cup of something is how you end up with the wrong amount.',
        ],
        code: {
          lang: "text",
          caption: "how a few lines get read (the app shows this under \u201cCheck how it was read\u201d)",
          text: "\n1 \u00bd cups grated parmesan    \u2192  1.5  cup        parmesan, grated\n1 (28 oz) can tomatoes      \u2192  1    can 28 oz  tomatoes\n4 cloves garlic, minced     \u2192  4    clove      garlic, minced\nsalt to taste               \u2192  \u2014               salt \u00b7 to taste\n",
        },
        figures: [
          { src: '/images/projects/cook-split/past-recipes.webp', alt: "Past recipes picker with Chicken Alfredo and Butter Chicken selected", caption: "Picking from past recipes; each one is scaled to tonight\u2019s headcount." },
          { src: '/images/projects/cook-split/not-split.webp', alt: "Grocery list with basmati rice marked not split", caption: "The merged list, grouped by section. The rice is marked \u201cnot split.\u201d" },
        ],
      },
      {
        heading: 'Splitting the bill',
        paragraphs: [
          'Everyone enters what they paid. The split is even among the people who ate, all in whole cents so it always adds up exactly. Settling up uses the fewest possible payments: it finds groups of people whose balances cancel out and settles each group separately, then gives you Venmo links with the amount filled in.',
          'Some things one person buys for themselves, like a big bag of rice they’ll keep, so any grocery item can be marked “not split” and it comes off that person’s receipt first.',
        ],
        code: {
          lang: "ts",
          caption: "src/lib/settle.ts",
          text: "\n// dp[m] = max number of zero-sum groups among the people in bitmask m.\n// Fewest transfers = (people with a balance) \u2212 dp[everyone].\nfor (let m = 1; m <= full; m++) {\n  let best = 0\n  for (let i = 0; i < n; i++) if (m & (1 << i)) best = Math.max(best, dp[m ^ (1 << i)])\n  dp[m] = best + (sum[m] === 0 ? 1 : 0)\n}\n",
        },
        figures: [
          { src: '/images/projects/cook-split/settle.webp', alt: "Settle up screen with two Venmo transfers", caption: "Settling up: two transfers, each with a Venmo link." },
        ],
      },
      {
        heading: 'No backend',
        paragraphs: [
          'The whole dinner (recipes, people, payments) gets compressed into the share link itself, so you can send one link to the group chat and everyone sees the same thing, with no accounts and nothing stored on a server.',
        ],
      },
    ],
    links: [
      { label: 'Try it', href: 'https://allenliu.dev/cooksplit' },
      { label: 'Code', href: 'https://github.com/wildwastaken/cook-split' },
    ],
  },
  {
    slug: 'photo-picker',
    title: 'Photo Picker',
    subtitle: 'Picks the best dozen photos from a trip so I don’t have to scroll through 1,300.',
    meta: 'Side project · 2025 · command line, no website',
    facts: [
      { value: '1,298', label: 'Iceland photos in' },
      { value: '407', label: 'left after removing duplicates' },
      { value: '12', label: 'picks out' },
    ],
    sections: [
      {
        heading: 'Why',
        paragraphs: [
          'After a trip I have a thousand photos, half of them five shots of the same waterfall. Picking a few good ones for this site took forever, so I wrote something to do the first pass.',
        ],
      },
      {
        heading: 'Scoring',
        paragraphs: [
          'Every photo gets scored on sharpness (how much detail survives an edge filter), exposure (penalizing blown highlights and crushed shadows) and colorfulness. When it reads from the Apple Photos library, it also uses the aesthetic score Apple already computes for each photo, plus a bonus for favorites. It works on a temporary copy of the library database and never touches the original.',
        ],
        code: {
          lang: "python",
          caption: "photopicker/scoring.py",
          text: "\ndef sharpness_score(img: Image.Image) -> float:\n    \"\"\"Map Laplacian variance to 0..1 on a log scale (var ~1000 -> 1.0).\"\"\"\n    v = laplacian_variance(img)\n    return float(np.clip(np.log10(1.0 + v) / 3.0, 0.0, 1.0))\n\ndef exposure_score(img: Image.Image) -> float:\n    \"\"\"1.0 for well exposed; penalise clipped highlights/shadows and extreme means.\"\"\"\n    g = _gray(img)\n    clipped_hi = float((g >= 250).mean())\n    clipped_lo = float((g <= 5).mean())\n    mean_dev = abs(g.mean() - 127.5) / 127.5\n    s = 1.0 - 2.5 * (clipped_hi + clipped_lo) - 0.6 * mean_dev ** 2\n    return float(np.clip(s, 0.0, 1.0))\n",
        },
      },
      {
        heading: 'Duplicates and variety',
        paragraphs: [
          'Near-duplicates are found with a tiny perceptual hash of each image, and bursts (shots seconds apart that look alike) are collapsed to their best frame. Then picking is a tradeoff between quality and variety: each next pick is the best photo that isn’t too similar in time, place (from GPS) or look to the ones already chosen.',
          'It writes the picks to a folder plus a contact sheet showing every score, so you can see why it chose what it chose. On my Iceland trip it went from 1,298 photos to 12, and one of my favorite shots, the arch at Arnarstapi, came out second.',
        ],
        figures: [
          { src: '/images/projects/photo-picker/contact-sheet.webp', alt: "Contact sheet of picked Iceland photos with score bars", caption: "The contact sheet from my Iceland trip: each pick with its scores, and how similar it is to the picks before it." },
        ],
      },
    ],
    links: [{ label: 'Code', href: 'https://github.com/wildwastaken/photo-picker' }],
  },
  {
    slug: 'hut-monitor',
    title: 'Hut Monitor',
    subtitle: 'Campsite openings on Recreation.gov, the moment they appear.',
    meta: 'Side project · 2025 · command line, no website',
    sections: [
      {
        heading: 'Why',
        paragraphs: [
          'Popular campgrounds book out the minute reservations open, and the only way in later is grabbing a cancellation before someone else does. I spent 2020 writing bots that watched for restocks, so this is the same idea for campsites.',
        ],
      },
      {
        heading: 'How it works',
        paragraphs: [
          'You list what you want in a small config file: a campground, arrival date (or a range of possible arrival dates), number of nights, and optionally site types or specific sites. It pulls the month-by-month availability from Recreation.gov, looks for stretches where every night is open, and reports each new opening with a booking link, in the terminal, in Discord or as a Mac notification.',
          'It remembers what it has already told you, so each opening alerts once, and it never checks a campground more often than every few minutes, to be polite to the site.',
        ],
        code: {
          lang: "toml",
          caption: "watches.toml",
          text: "\n[[watch]]\nname = \"Upper Pines, 2 nights\"\nprovider = \"recgov\"\ncampground_id = \"232447\"     # Upper Pines, Yosemite\narrive = 2027-05-21          # first night\nnights = 2                   # every night must be available\n# arrive_end = 2027-05-23    # optional: any arrival in this range\n# site_types = [\"TENT\", \"STANDARD\"]\n",
        },
        figures: [
          { src: '/images/projects/hut-monitor/terminal.webp', alt: "Terminal output listing new campsite openings at Upper Pines", caption: "A real run: searching for the campground, then a check that finds open sites. Run it again and it stays quiet: each opening only alerts once." },
        ],
      },
      {
        heading: 'Limits',
        paragraphs: [
          'AMC’s huts in the White Mountains are what I actually wanted, but AMC has no public availability feed, so for now those just print the booking link. Recreation.gov works for real: a test run found open sites at Upper Pines in Yosemite.',
        ],
      },
    ],
    links: [{ label: 'Code', href: 'https://github.com/wildwastaken/hut-monitor' }],
  },
  {
    slug: 'tabs',
    title: 'tabs',
    subtitle: 'Started as a way to print guitar tabs for a friend. Turned into a setlist tool a group actually uses.',
    meta: 'Side project · 2025 to now',
    facts: [
      { value: '43', label: 'commits' },
      { value: 'PDF + DOCX', label: 'export' },
    ],
    sections: [
      {
        heading: 'Why',
        paragraphs: [
          'A friend wanted clean printouts of Ultimate Guitar tabs: no ads, the right key, big enough to read from a music stand. The first version was one page that took a link, cleaned up the tab and let you transpose it.',
        ],
      },
      {
        heading: 'What it does now',
        paragraphs: ['It grew once more people started using it:'],
        bullets: [
          'A setlist editor: add songs from a shared library, from Ultimate Guitar links (one or many at once) or by pasting text, drag to reorder, and transpose each song separately.',
          'Export the whole setlist to PDF or Word, with note boxes you can position on the page.',
          'A shared song library and saved setlists in Postgres, so everyone sees the same versions.',
          'Autoscroll for playing straight off the screen.',
        ],
        figures: [
          { src: '/images/projects/tabs/editor.webp', alt: "tabs editor with the shared song library", caption: "The editor and the shared song library, up to 69 songs." },
        ],
      },
      {
        heading: 'Interesting bits',
        paragraphs: [
          'Ultimate Guitar doesn’t want to be fetched from a browser, so links are fetched on the server, with public CORS proxies as a fallback. The tab itself is buried in a big JSON blob on the page, next to comments and ads, so the parser prefers the documented path and otherwise picks the longest field that actually contains chord markup.',
          'Transposing is the fun part. Chords are marked up inline, so each one gets parsed, shifted and printed back in sharps or flats (your pick, with an option to simplify extended chords). When a chord gets longer or shorter, say G to G#m, the line is padded so the lyrics underneath stay lined up.',
          'Editing and deleting shared songs sits behind a password so a stray click can’t wipe the library, and publishing posts a note to a Discord channel.',
        ],
        code: {
          lang: "ts",
          caption: "pages/index.tsx (trimmed)",
          text: "\nconst parts = chords.split(/\\[ch\\]|\\[\\/ch\\]/g)        // odd indexes are chords\nfor (let i = 1; i < parts.length; i += 2) {\n  const before = prettyPrint(parse(parts[i], {}), { naming: tones })\n  const after = prettyPrint(transpose(parse(parts[i], {}), step), { naming: tones })\n  const diff = after.length - before.length\n  // pad so the lyrics under the chord line stay aligned\n  parts[i] = `[ch]${after}[/ch]` + (diff >= 0 ? '-'.repeat(diff) : ' '.repeat(-diff))\n}\n",
        },
      },
    ],
    links: [
      { label: 'Open tabs', href: 'https://tabs.allenliu.dev' },
      { label: 'Code', href: 'https://github.com/wildwastaken/tabs' },
    ],
  },
  {
    slug: 'geompt',
    title: 'GeomPT',
    subtitle: 'Measuring range of motion for physical therapy with just a webcam. 2nd place overall at HackMIT 2024.',
    meta: 'HackMIT 2024 · with Sandro Gopal, Hector Astrom and Steven Zhang',
    facts: [
      { value: '2nd', label: 'overall, HackMIT 2024' },
      { value: '1 webcam', label: 'no special hardware' },
    ],
    sections: [
      {
        heading: 'The problem',
        paragraphs: [
          'We built this at HackMIT 2024 as a team of four: Sandro Gopal, Hector Astrom, Steven Zhang and me.',
          'Recovery after an injury depends on patients doing their exercises at home, and therapists mostly find out how it went at the next visit, when they measure range of motion by hand. We wanted therapists to see real measurements between visits without asking patients to buy anything.',
        ],
      },
      {
        heading: 'How it works',
        paragraphs: [
          'The browser streams webcam frames over a websocket to a Flask server. There, MediaPipe’s pose model finds the joints, OpenCV draws vectors between the limbs, and we compute the joint angle, smoothed with a rolling average so it doesn’t jitter. When the angle crosses a threshold the measurement is captured automatically, so the patient doesn’t have to click anything mid-stretch.',
          'Results are saved per patient and per exercise in Firebase, and the Next.js frontend has a live view, a progress page that charts range of motion over time, and a page of exercises aimed at improving it.',
        ],
        code: {
          lang: "python",
          caption: "opencv_logic.py",
          text: "\ndef calculateAngle(a, b, c):\n    \"\"\"Calculate the angle between three points (a, b, c), where b is the vertex.\"\"\"\n    a, b, c = np.array(a), np.array(b), np.array(c)\n    ba = a - b\n    bc = c - b\n    # add epsilon to avoid division by zero\n    cosine_angle = np.dot(ba, bc) / (np.linalg.norm(ba) * np.linalg.norm(bc) + 1e-6)\n    cosine_angle = np.clip(cosine_angle, -1.0, 1.0)   # float error\n    return np.degrees(np.arccos(cosine_angle))\n",
        },
      },
      {
        heading: 'What I learned',
        paragraphs: [
          'Getting a believable angle out of noisy pose landmarks in real time was most of the work: camera position, smoothing, and deciding when a reading counts. Doing it in a weekend meant picking the one flow that mattered (measure, save, show progress) and making that solid for the demo.',
        ],
      },
    ],
    links: [{ label: 'Code', href: 'https://github.com/orgs/GeomPT/repositories' }],
  },
  {
    slug: 'bareshelves',
    title: 'bareshelves',
    subtitle: 'Restock alerts for masks, sanitizer and other essentials during the 2020 shortages.',
    meta: '2020–2021 · with Andrew · my first real project',
    sections: [
      {
        heading: 'Why',
        paragraphs: [
          'In 2020 the things everyone needed were sold out everywhere and came back in stock for minutes at a time. I wanted to know the moment they did.',
        ],
      },
      {
        heading: 'How it worked',
        paragraphs: [
          'It started as AmznMonitor in the summer of 2020: a Python script that loaded Amazon’s offer pages for a product, parsed the sellers and prices, and posted to a Discord channel when it was back in stock. Amazon pushes back on bots, so a lot of the code is about looking like a normal browser and retrying when it hits a captcha.',
          'That grew into a set of bots watching masks, sanitizer, cleaning products and household basics, sending a notification when anything came back.',
          'BareShelves was a team effort with my friend Andrew. I spent most of my time on the monitor, we designed the website together, and past that it’s hard to say who did what. We built it together. These days the site is an archive of what it tracked.',
        ],
        figures: [
          { src: '/images/projects/bareshelves/archive.webp', alt: "BareShelves browse page: back-in-stock products with photos, stock badges and prices", caption: "The site as it looked: back in stock, popular and out of stock, with a follow button on every product." },
        ],
      },
      {
        heading: 'Looking back',
        paragraphs: [
          'It was messy code (one file is literally called spaghetti.py), but it was the first thing I built that people relied on, and it’s where I learned scraping, scheduling and the fun of something actually being useful.',
          'It’s also where I learned about secrets the hard way: 2020 me hardcoded the Discord webhook URL right at the top of the script and pushed it to a public repo, where it sat for years. It’s dead now, so no, you can’t use it to spam my old restock channel. These days every key lives in an environment variable and the repo gets checked before it goes public.',
        ],
        code: {
          lang: "python",
          caption: "new.py, line 10, as committed in 2020",
          text: "\nfrom dhooks import Webhook, Embed\n\nhook = Webhook('https://discordapp.com/api/webhooks/\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588/\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588')  # in plain text. in a public repo.\n",
        },
      },
    ],
    links: [
      { label: 'Archive', href: 'https://bareshelves.allenliu.dev' },
      { label: 'Code', href: 'https://github.com/wildwastaken/amznmonitor' },
    ],
  },
]

export function getProjectPost(slug: string): ProjectPost | undefined {
  return projectPosts.find((p) => p.slug === slug)
}
