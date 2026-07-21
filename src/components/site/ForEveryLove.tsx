const cards = [
  {
    label: "The Deployed Parent",
    headline: "He's overseas. He's still there at bedtime.",
    body: "Record 30 nights of stories before you go. They scan the blanket. You're there.",
  },
  {
    label: "The Grieving Family",
    headline: "Her voice is still here.",
    body: "A voicemail. A laugh. A lullaby she used to sing. Behind a QR. On something they keep forever.",
  },
  {
    label: "The Grandparent",
    headline: "Before the stories are gone.",
    body: "Nana reads their favorite book. Grandpa tells the family stories. Preserved. Forever.",
  },
  {
    label: "The New Parent",
    headline: "Record it tonight.",
    body: "The night they came home. While they're asleep on your chest. Before you forget what this feels like. We'll keep it forever.",
  },
  {
    label: "The Graduate",
    headline: "Four years. One moment.",
    body: "For the kid heading to college, crossing the stage, or starting over.",
  },
  {
    label: "The Pet Family",
    headline: "I still look for you.",
    body: "Record what you'd say if you could. We'll wrap it in music and keep it somewhere you can always find it.",
  },
  {
    label: "The Couple",
    headline: "The words she said. Playing again.",
    body: "Your vows. A love letter read aloud. Behind a QR. On something you both keep.",
  },
  {
    label: "The Recovery Milestone",
    headline: "Every day sober is worth remembering.",
    body: "A message of pride. A voice that believes in them. For the milestone that changed everything.",
  },
  {
    label: "The Terrible Gift Giver",
    headline: "You're not bad at gifts. You just haven't found the right one yet.",
    body: "Something original. Something that plays. Something they'll never throw away.",
  },
  {
    label: "The Pregnancy Announcement",
    headline: "Two lines. One song.",
    body: "Announce it in a way they'll replay forever. Scan the card, hear the news wrapped in music.",
  },
  {
    label: "The Gender Reveal",
    headline: "Blue or pink. Yours forever.",
    body: "Wrap the big reveal in an original song — press play the moment they find out.",
  },
  {
    label: "The Proposal",
    headline: "They said yes. Now it plays forever.",
    body: "The question. The song underneath it. Something to scan and relive on every anniversary.",
  },
  {
    label: "The Retirement",
    headline: "Forty years of Mondays. One song for what's next.",
    body: "For the career that mattered. A song for everything they built, and everything ahead.",
  },
  {
    label: "The Thank You",
    headline: "Some thank-yous need more than a card.",
    body: "For the person who showed up when it counted. Say it in a way they'll keep.",
  },
];

const featuredLabels = [
  "The Deployed Parent",
  "The Grieving Family",
  "The Grandparent",
  "The New Parent",
  "The Pet Family",
  "The Couple",
  "The Graduate",
  "The Recovery Milestone",
  "The Terrible Gift Giver",
];

export const ForEveryLove = () => {
  return (
    <section className="bg-gradient-cream pt-10 md:pt-14 pb-20 md:pb-28">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-20 space-y-5">
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-navy text-balance">
            For every kind of <span className="italic text-rose">love</span>
          </h2>
          <p className="text-base md:text-lg text-navy/70 leading-relaxed">
            For anyone who matters.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {cards.filter(c => featuredLabels.includes(c.label)).map((c, i) => (
            <article
              key={c.label}
              className="group bg-cream rounded-2xl py-4 px-5 shadow-soft hover:shadow-card transition-all duration-500 hover:-translate-y-1 border border-border/40 animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <p className="label-eyebrow text-gold mb-3">{c.label}</p>
              <h3 className="font-serif text-lg text-navy leading-snug mb-3 text-balance">
                {c.headline}
              </h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                {c.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
