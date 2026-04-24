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
    headline: "A lullaby composed just for them.",
    body: "Before they're old enough to remember — they'll have it forever.",
  },
  {
    label: "The Graduate",
    headline: "Four years. One moment.",
    body: "For the kid heading to college, crossing the stage, or starting over.",
  },
  {
    label: "The Pet Family",
    headline: "They were family. Every single day.",
    body: "A song for the one who greeted you at the door. Whose spot on the couch is still warm in your heart.",
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
];

export const ForEveryLove = () => {
  return (
    <section className="bg-gradient-cream pt-10 md:pt-14 pb-20 md:pb-28">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20 space-y-5">
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-navy text-balance">
            For every kind of <span className="italic text-rose">love</span>
          </h2>
          <p className="text-base md:text-lg text-navy/70 leading-relaxed">
            Not just for babies. Not just for loss.<br />
            For anyone who matters.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {cards.map((c, i) => (
            <article
              key={c.label}
              className="group bg-cream rounded-2xl py-4 px-5 shadow-soft hover:shadow-card transition-all duration-500 hover:-translate-y-1 border border-border/40"
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
