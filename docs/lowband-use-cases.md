<!-- Research by Codex (codex-cli 0.145.0, live web search, read-only), 2026-10-28. Spot-checked by Claude the same day:
     - Spotify Developer Policy, section III items 5 and 7, effective 15 May 2025: quotes confirmed verbatim.
     - Plex announcement: TIDAL turned off 28 Oct 2024; library entries stay but cannot play: confirmed.
     - Edison Research 16% figure: NOT re-checked (the page now redirects to ssrs.com and returns a redirect loop).
     Everything else is as Codex reported; its own unverified list is section 6. -->

# Lowband evidence review

Research date: 28 October 2026. I opened every source linked below. Product usage figures are vendor-reported unless stated otherwise; Reddit posts are anecdotes, not prevalence estimates.

## 1. Ranked real-world use cases

### 1. Find the version that Spotify—or another conventional catalog—does not carry

**Who it is for:** Listeners seeking unofficial remixes, covers, edits, live performances, DJ sets, demos, unreleased recordings, old uploads, or obscure regional releases.

**Pain in users’ words:**

- “I can add audio from videos to my playlists. This makes it possible to have live tracks and unofficial releases.”
- “There’s user uploaded versions of some songs that aren’t on any other music streaming app.”
- “Some songs I can’t find on Spotify but I can on YouTube Music.”  
  — [YouTube Music user discussion](https://www.reddit.com/r/YoutubeMusic/comments/1w383y7/to_people_who_use_youtube_music_over_spotify/)

**How often it happens:** The gap is demonstrably common as a *category*, but I found no defensible percentage of songs or listeners affected.

Evidence of scale:

- YouTube says YouTube Music contains more than 100 million songs plus “covers, remixes, live performances, and content that is hard to find elsewhere.” [YouTube’s guide](https://blog.youtube/news-and-events/get-started-youtube-music/)
- Users may upload as many as 100,000 private tracks. Those tracks can be mixed into their own playlists, but other people—including family-plan members—cannot play them. [YouTube Music Help](https://support.google.com/youtubemusic/answer/9716522?hl=en)
- SoundCloud describes itself as an upload-first, artist-to-fan platform with 40 million-plus creators and more than four times the catalog of a major platform. [SoundCloud](https://soundcloud.com/company/about-us/)
- Google expressly warns that a transfer may omit songs because catalogs differ: “if YouTube Music contains a song that Apple Music doesn’t, that song won’t be transferred.” It also excludes private and user-uploaded material. [Google Account Help](https://support.google.com/accounts/answer/14792019)

**Assessment of the owner’s case:** Strongly supported. The exact size of the Spotify↔YouTube Music gap is unverified, but both Google’s documentation and numerous listener reports establish that it is real and especially concentrated in nonstandard versions and user uploads. The reverse also occurs: one user reported a band having “way more songs” on Spotify than YouTube Music. [User discussion](https://www.reddit.com/r/YoutubeMusic/comments/s9p2ff/am_i_wrong_for_paying_two_streaming_services_at/)

**What Lowband should do:** Provide one search result grouped by underlying recording/composition, then show all available versions and their source: official recording, live version, cover, remix, video upload, SoundCloud track, or local/private upload. Do not silently substitute one version for another.

---

### 2. Preserve playlists when tracks disappear, change identifiers, or become region-locked

**Who it is for:** People with long-lived playlists and collectors who expect saved music to remain playable.

**Pain in users’ words:**

- “I’m constantly revisiting old playlists to find stuff I added 5 years ago suddenly greyed out.”
- “It’s not whole albums but rather one or two songs from each album.”
- A Spotify user found that the desired songs from a Willie Nelson compilation were greyed out on either Spotify or YouTube.  
  — [Apple Music thread](https://www.reddit.com/r/AppleMusic/comments/11ln4qn/i_keep_finding_grayed_out_songs_in_my_playlists/), [Spotify thread](https://www.reddit.com/r/truespotify/comments/1008465/why_are_some_of_the_songs_greyed_out_i_can_click/)

**Why it happens:**

- Territorial licensing and rights expiration.
- Artist or label takedowns.
- A release is replaced by a new catalog entry while a playlist retains the obsolete entry.
- Copyright enforcement against unofficial uploads.
- Service-side sync defects can look like licensing failures; not every greyed-out track is a true catalog loss.

A conspicuous example was the 2022 Spotify boycott: seven musicians, including Neil Young and Joni Mitchell, removed music over the Joe Rogan controversy. Young’s absence lasted more than two years before his 2024 return. [Contemporary boycott report](https://www.axios.com/2022/02/01/spotify-boycott-list-joe-rogan-neil-young), [return report](https://www.axios.com/2024/03/13/neil-young-spotify-returns-joe-rogan)

**How often it happens:** No platform publishes a catalog-churn or greyed-track rate. User reports describe it as recurring, but that does not quantify prevalence.

**What Lowband should do:** Retain the unavailable entry rather than deleting it, label why it is unavailable when known, search for:

1. The same ISRC elsewhere.
2. A reissued entry with matching metadata and duration.
3. Another licensed service.
4. A clearly labeled alternative recording or user upload.

Users should approve ambiguous replacements.

---

### 3. Maintain one personal library across multiple paid or bundled services

**Who it is for:** People paying for several audio products, or who receive YouTube Music through YouTube Premium while retaining Spotify or Apple Music.

**How common it is:** Edison’s Q1 2025 US survey found:

- 10% of Americans aged 13+ paid for exactly two audio subscription services.
- A further 6% paid for more than two.
- Therefore, 16% paid for multiple audio subscriptions.  
  [Edison Research](https://www.edisonresearch.com/majority-of-americans-pay-for-audio-but-some-are-cutting-services/)

This measures all paid audio subscriptions, not specifically two on-demand music services. It may include products such as satellite radio or audiobook services, so it is an upper bound for Lowband’s exact market.

**Pain and motivation:**

- Users repeatedly say YouTube Music is “included in YouTube Premium,” while still preferring Spotify as the music application.
- One respondent said: “I have YouTube premium, but Spotify is a better music app.”
- Another switched because they were already paying for YouTube Premium and did not want to pay twice.  
  [YouTube Music discussion](https://www.reddit.com/r/YoutubeMusic/comments/1w383y7/to_people_who_use_youtube_music_over_spotify/)

**What Lowband should do:** Let the user connect available accounts, choose a default service, and use another service only when the default lacks the selected recording. Keep favorites and Lowband playlists service-neutral rather than treating any provider as the canonical library.

---

### 4. Share songs and playlists across a couple, family, or friend group using different services

**Who it is for:** Spotify users sending music to Apple Music or YouTube Music users, and vice versa.

**Pain in users’ words:** A Spotify user wanting to make a birthday playlist for an Apple Music-using boyfriend asked whether the playlist could be shared across services. [Reddit discussion](https://www.reddit.com/r/NoStupidQuestions/comments/1e0f7tq)

This is also the core use case of universal-link tools: resolve one service’s URL into corresponding links on the recipient’s service. An Odesli/Songlink API description documents resolution among Spotify, Apple Music, YouTube, Deezer, Tidal, Amazon, and SoundCloud, without streaming or library management. [Odesli API description](https://jentic.com/apis/odesli.co/odesli)

**How often it happens:** I found anecdotal demand and substantial tool adoption, but no representative survey measuring mixed-service couples or households.

**What Lowband should do:** Generate a provider-neutral song or playlist link. On open, select the recipient’s preferred service and show unmatched tracks explicitly. This is materially safer than trying to stream all providers inside one player.

---

### 5. Switch services without abandoning years of playlists and liked music

**Who it is for:** Users changing service for price, bundle value, features, ethics, device support, or catalog availability.

**Demand signal:**

- Soundiiz claims 13 million registered users, 375 million transferred playlists, and support for more than 45 services. [Soundiiz](https://soundiiz.com/about)
- FreeYourMusic transfers playlists, albums, and liked songs among 16 services and offers a recurring synchronization product. [FreeYourMusic](https://freeyourmusic.com/about)
- SongShift supports transfers from 13 services. It warns that uploaded or unreleased tracks transfer only if the destination contains them. [SongShift FAQ](https://www.songshift.com/faq)
- Google officially points YouTube Music users toward Soundiiz and TuneMyMusic for some exports. [Google Account Help](https://support.google.com/accounts/answer/14792019)

**What goes wrong:**

- Provider-curated playlists, liked-song collections, collaborative playlists, private uploads, and downloaded files are not always portable.
- In an AP test involving 16,359 items, the transfer completed in about five minutes but missed several dozen songs; the tool attributed misses to absence or naming differences. The reporter also could not transfer certain Spotify-generated playlists and the Liked Songs list in the tested workflow. [AP transfer test](https://apnews.com/article/apple-spotify-streaming-music-transfer-63a137afdfbf94c8cea3ec4909255d83)
- Transfers normally copy metadata and reconstruct playlists; they do not move audio files.

**What Lowband should do:** Treat import as a reviewable process: matched, uncertain, unavailable, and private/uploaded. Preserve the source identifier and never report “complete” without an unmatched-track report.

---

## 2. Existing products

| Product/category | What it gets right | What it gets wrong or cannot do |
|---|---|---|
| **Soundiiz** | Very broad service coverage; transfer, management, and synchronization; strongest disclosed demand signal at 13M users and 375M playlists. | Reconstructs playlists in destination catalogs; it cannot make a missing recording exist or provide unified licensed playback. Numbers are company claims. |
| **TuneMyMusic** | Simple web migration and service partnerships; supports large migrations and reports missing tracks. | Catalog/name mismatches remain; transfer support varies by provider and playlist type. Its advertised accuracy was not independently verified here. |
| **SongShift** | Clear service matrix and integration with Apple Music’s import experience. | Explicitly cannot transfer custom uploads unless the same song exists in the destination catalog. [FAQ](https://www.songshift.com/faq) |
| **FreeYourMusic** | Cross-platform apps, transfer, automatic synchronization, and a B2B engine used for service onboarding. | Synchronizes catalog entries, not rights or audio; unavailable tracks remain unavailable. [Product description](https://freeyourmusic.com/about) |
| **Odesli/song.link** | Provider-neutral sharing and cross-service links; useful for friends on different services. | Resolves links only—it does not play music, modify libraries, or solve licensing. Current API availability could not be independently verified beyond the opened third-party API description. |
| **Spotube** | Demonstrates demand for a single cross-platform interface and pluggable metadata/audio sources; its repository had roughly 50,000 stars when checked. [GitHub](https://github.com/team-spotube/spotube) | Mixing one provider’s metadata with another source’s audio creates matching errors and likely platform-policy problems. Community reports mention broken plugins, wrong sources, and playback failures. It is not a sound legal model for a commercial Lowband. |
| **Harmony** | Historically offered multiple services and local music in one desktop UI. [Archived repository](https://github.com/vincelwt/harmony) | The repository is archived. Its reliance on changing service integrations illustrates maintenance and policy fragility. |
| **Plex/Plexamp + TIDAL** | A genuine example of streaming-service content integrated with a personal library. | TIDAL ended the Plex integration in October 2024; retained library entries became unplayable. [Plex announcement](https://forums.plex.tv/t/tidal-integration-with-plex-ending-october-28-2024/885728) This is strong evidence that even negotiated integrations can disappear. |
| **Cider** | A polished alternative Apple Music client with customization, lyrics, remote control, and integrations. [Cider](https://cast.cider.sh/) | It is an Apple Music client, not a cross-catalog aggregator. |
| **Roon** | **Partially verified:** known as a library-oriented product with selected streaming integrations. | I did not obtain an opened primary source confirming its current service matrix, so no current-service claim is made. |
| **Musicolet / Doppler** | Useful conceptual references for local-first library and playback UX. | They are not verified here as multi-commercial-service aggregators. |

The market split is important: mature products generally offer **transfer/sync**, **universal links**, or **one service plus local files**. Products promising arbitrary unified playback tend to depend on unofficial interfaces or unstable source substitution.

## 3. Platform constraints

This is a product-policy reading, not legal advice.

### Spotify

Spotify’s effective May 2025 Developer Policy is the clearest obstacle:

> “Do not create any product or service which is integrated with streams or content from another service.”

It also says:

> “Do not permit any device or system to segue, mix, re-mix, or overlap any Spotify Content with any other audio content.”

Additional requirements include:

- Spotify content must be attributed.
- Metadata and preview clips must link back to Spotify.
- Spotify playback must display the relevant metadata and cover art.
- Music streaming through the Spotify Platform is restricted to Premium subscribers.  
  [Spotify Developer Policy](https://developer.spotify.com/policy)

**Rules out:** A Spotify-authorized Lowband player with a single mixed queue that transitions between Spotify and YouTube/Apple/SoundCloud streams. It also strongly disfavors presenting Spotify catalog data as a service-neutral standalone catalog.

**Potentially viable:** Search/link results that clearly identify Spotify and link back; playlist metadata transfer undertaken for the user; controlling or handing off to the official Spotify application, subject to approval and the rest of Spotify’s terms.

### YouTube and YouTube Music

The public YouTube APIs support data access and the visible YouTube embedded player—not a general YouTube Music audio SDK. Relevant policy restrictions include:

> Do not “separate, isolate, or modify the audio or video components” of YouTube audiovisual content.

And do not:

> “create, include, or promote features” that play YouTube content “from a background player” not displayed on the current page, tab, or screen.

The policies also prohibit blocking or replacing YouTube advertising or modifying the YouTube player. [YouTube API Developer Policies](https://developers.google.com/youtube/terms/developer-policies)

**Rules out:** Extracting audio from a YouTube video into Lowband’s native player; an invisible YouTube iframe used as a background audio engine; removing ads or YouTube branding; offline downloads outside the authorized YouTube experience.

**Potentially viable:** A visible, unmodified YouTube embedded player while Lowband remains foregrounded, or deep-linking/handoff to YouTube/YouTube Music. Normal mobile background playback would need to occur in YouTube’s own entitled experience, not through a hidden Lowband embed.

**Unverified but important:** I found no official public YouTube Music catalog-and-playback API comparable to MusicKit. That negative cannot be proven by a clause saying “there is no API,” but Google’s published developer surface and policies expose YouTube video/data APIs, not a public YouTube Music playback SDK.

### Apple Music / MusicKit

Apple permits authorized applications to search the Apple Music catalog, manage a user’s library and playlists, and play Apple Music through MusicKit on Apple platforms, Android, and the web. [MusicKit overview](https://developer.apple.com/musickit/)

The Apple Developer Program License Agreement says:

> “MusicKit Content cannot be synchronized with any other content, unless otherwise permitted by Apple in the Documentation.”

It also requires:

> “You may play MusicKit Content only as rendered by the MusicKit APIs or MusicKit JS.”

And MusicKit JS must be used as a stand-alone library rather than recombined or re-hosted. [Apple Developer Program License Agreement](https://developer-rno.apple.com/support/terms/apple-developer-program-license-agreement/)

**Rules out:** Downloading or extracting Apple Music audio; playing it through Lowband’s own decoder; synchronizing Apple Music content with external audio absent specific Apple permission.

**Potentially viable:** Apple Music playback rendered by MusicKit inside an authorized Apple Music portion of the application, with active-subscription checks. Whether Apple would approve an application that alternates MusicKit playback with other providers in one apparent queue needs written clarification; the “cannot be synchronized” language makes an ambitious unified player risky.

### Practical conclusion

A fully seamless commercial “one player” that plays Spotify, Apple Music, and YouTube-origin audio through one neutral engine is not supported by the standard public terms.

The defensible Lowband shape is:

- A service-neutral library, availability index, search interface, and universal-link layer.
- Official playback surfaces kept technically and visually separate.
- Handoff to each service’s official app/SDK/player.
- No cross-provider audio mixing, extraction, or invisible YouTube playback.
- No promise that every provider can be controlled identically.

## 4. Matching songs across services

### Recommended matching sequence

1. **Exact provider ID** when revisiting a known catalog entry.
2. **ISRC exact match** for the same sound recording.
3. **Normalized metadata match:** title, primary and featured artists, album, duration, version markers, and explicit status.
4. **Conservative fuzzy match** only when identifiers are unavailable.
5. **User confirmation** for uncertain or semantically different matches.

A working transfer tool, Tuneshift, describes exactly this pattern: ISRC first, followed by title, artist, album, and duration, with a confidence indicator. It lists destination absence, region locks, and different naming as common causes of unmatched tracks. [Tuneshift FAQ](https://www.tuneshift.co/faq)

### Accuracy problems

- ISRC identifies a **recording**, not merely a composition. A studio recording, live take, remix, remaster, radio edit, and cover should not be treated as interchangeable.
- The same apparent release may have different ISRCs after remastering or redelivery.
- Incorrect or missing distributor metadata weakens ISRC matching.
- YouTube uploads frequently lack an exposed, trustworthy ISRC.
- Titles contain noise: “official video,” “lyrics,” “remastered,” featured artists, transliteration differences, punctuation, and uploader branding.
- Duration can differ because of silence, video intros, music-video edits, or speed changes.
- Region-specific search results mean a correct global match may still be unplayable for the current user.
- Fuzzy matching can select the right song but the wrong recording. One user specifically complained about a tool fetching a live-concert version for a studio recording. This anecdote was found, but because the final source was not sufficiently authoritative it should be treated as **unverified anecdotal evidence**.
- The AP migration test’s missing tracks demonstrate real-world matching/catalog failures, but do not yield a general accuracy percentage. [AP](https://apnews.com/article/apple-spotify-streaming-music-transfer-63a137afdfbf94c8cea3ec4909255d83)

## 5. Recommended key decisions

1. **Define Lowband as a universal library and routing layer, not one neutral audio engine.**  
   Spotify explicitly bans products integrated with another service’s streams; YouTube bars hidden/background extraction; Apple requires MusicKit rendering.

2. **Put availability first in the UI.**  
   Every song page should show where that exact recording is playable, in which region if known, and whether an entry is official, live, remix, cover, user upload, or local. Google itself confirms catalog differences cause failed transfers.

3. **Match exact recordings by ISRC, then use conservative fuzzy matching.**  
   Compare artist, title, album, duration and version labels. Never silently substitute live, remastered, sped-up, cover, or clean versions. Show confidence and request confirmation below a threshold.

4. **Store Lowband playlists independently of provider playlists.**  
   Each item should retain a canonical recording entity plus multiple provider candidates and historical unavailable IDs. This lets a playlist survive takedowns, licensing changes, and service switching.

5. **Make handoff graceful and explicit.**  
   Users choose a default provider; Lowband opens its official playback surface when available and offers alternatives when not. A “continuous mixed queue” should not be promised until each provider grants written permission for that implementation.

## 6. Could not verify

The following should not be presented as established facts:

- **No verified percentage of Spotify tracks missing from YouTube Music, or vice versa.**
- **No verified frequency of greyed-out tracks, licensing removals, or playlist disappearance.**
- **No representative count of covers, remixes, live sessions, mixtapes, sped/slowed versions, fan uploads, or unreleased songs in YouTube Music.**
- **No representative survey specifically measuring households or couples split between Spotify, Apple Music, and YouTube Music.**
- Edison’s 16% figure covers multiple paid **audio** subscriptions, not necessarily multiple music-streaming subscriptions.
- **No verified current Bandcamp catalog or active-artist total** suitable for comparison.
- The exact number of SoundCloud-only or Bandcamp-only artists was not verified.
- Soundiiz and FreeYourMusic usage numbers are vendor claims; I found no independent audit.
- TuneMyMusic’s promotional accuracy claims were not independently verified.
- SongShift and TuneMyMusic total user counts were not verified.
- Odesli/song.link’s current first-party API status and uptime were not verified; the opened API description was third-party.
- The current Roon service matrix was not verified from an opened primary source.
- Musicolet and Doppler were not verified as cross-service streaming products; they appear adjacent rather than direct competitors.
- No official Google statement literally saying “YouTube Music has no public playback API” was found. The absence is inferred from the published developer products and documentation.
- Whether Apple would approve a MusicKit interface alongside separately handed-off Spotify or YouTube playback requires Apple’s written interpretation.
- Whether Spotify would permit a non-playing availability index containing Spotify-derived metadata alongside other providers requires direct review under its policy and branding rules.
- I did not verify that ISRCs are consistently exposed by every provider API available to Lowband.
- I found no trustworthy universal matching-accuracy benchmark across Spotify, Apple Music, YouTube Music, SoundCloud, and Bandcamp.