import Layout from '../components/Layout';

export default function RecipeApplePie() {
  return (
    <Layout>
      <div style={s.header}>
        <h2 style={s.title}>Classic American Apple Pie</h2>
      </div>

      <div style={s.meta}>
        <span><strong>Prep Time:</strong> 45 mins</span>
        <span><strong>Cook Time:</strong> 55 mins</span>
        <span><strong>Total Time:</strong> 1 hr 40 mins</span>
        <span><strong>Serves:</strong> 8</span>
        <span><strong>Category:</strong> Pies &amp; Desserts</span>
      </div>

      <Section title="About This Recipe">
        <p style={s.p}>
          This is the definitive homemade apple pie — a flaky, buttery double crust filled with tender
          cinnamon-spiced apples that hold their shape and release just enough juice to form a glossy,
          fragrant filling. Based on the classic American diner-style pie, this recipe has been a staple
          of home bakers for generations.
        </p>
      </Section>

      <Section title="Ingredients — Pie Crust (makes 2 discs)">
        <ul style={s.list}>
          {['2 ½ cups (315g) all-purpose flour', '1 tbsp granulated sugar', '1 tsp salt',
            '1 cup (225g) unsalted butter, very cold, cut into ½-inch cubes', '6–8 tbsp ice water']
            .map(i => <li key={i} style={s.li}>{i}</li>)}
        </ul>
      </Section>

      <Section title="Ingredients — Apple Filling">
        <ul style={s.list}>
          {['2 ½ lbs (about 6–7 medium) apples — Granny Smith and Honeycrisp mixed',
            '¾ cup (150g) granulated sugar', '2 tbsp brown sugar', '2 tbsp all-purpose flour',
            '1 tbsp cornstarch', '1 ½ tsp ground cinnamon', '¼ tsp ground nutmeg',
            '⅛ tsp ground allspice', '1 tsp fresh lemon juice', '½ tsp vanilla extract',
            '2 tbsp unsalted butter, cut into small pieces']
            .map(i => <li key={i} style={s.li}>{i}</li>)}
        </ul>
      </Section>

      <Section title="Ingredients — Egg Wash &amp; Finish">
        <ul style={s.list}>
          {['1 large egg, beaten with 1 tbsp milk', '1 tbsp coarse or granulated sugar (for sprinkling)']
            .map(i => <li key={i} style={s.li}>{i}</li>)}
        </ul>
      </Section>

      <Section title="Method — Make the Crust">
        <ol style={s.list}>
          {['In a large bowl, whisk together flour, sugar, and salt.',
            'Add the cold butter cubes. Using your fingertips or a pastry cutter, work the butter into the flour until the mixture resembles coarse crumbs with some pea-sized pieces remaining.',
            'Drizzle in ice water one tablespoon at a time, tossing with a fork after each addition, until the dough just holds together when pressed. Do not overwork.',
            'Divide the dough in half, flatten each half into a disc, wrap in plastic wrap, and refrigerate for at least 1 hour (or overnight).']
            .map((step, i) => <li key={i} style={s.li}>{step}</li>)}
        </ol>
      </Section>

      <Section title="Method — Make the Filling">
        <ol style={s.list}>
          {['Peel, core, and slice apples into ¼-inch thick slices.',
            'In a large bowl, toss apple slices with both sugars, flour, cornstarch, cinnamon, nutmeg, allspice, lemon juice, and vanilla extract.',
            'Let the mixture sit for 15 minutes — the apples will release their juices. This prevents a soggy bottom crust.']
            .map((step, i) => <li key={i} style={s.li}>{step}</li>)}
        </ol>
      </Section>

      <Section title="Method — Assemble &amp; Bake">
        <ol style={s.list}>
          {['Preheat oven to 425°F (220°C). Place a baking sheet on the lower rack to catch any drips.',
            'On a lightly floured surface, roll one disc of dough into a 12-inch circle. Fit it into a 9-inch pie dish, leaving a 1-inch overhang. Refrigerate while you prepare the top crust.',
            'Roll the second disc into a 12-inch circle.',
            'Drain any excess liquid from the apple filling, then mound it into the prepared crust. Dot the top with the small pieces of butter.',
            'Lay the top crust over the filling. Trim both crusts to a ½-inch overhang, then fold and crimp the edges together to seal.',
            'Cut 5–6 steam vents in the top crust. Brush the surface evenly with egg wash and sprinkle with coarse sugar.',
            'Bake at 425°F for 20 minutes, then reduce heat to 375°F (190°C) and bake for a further 35–40 minutes, until the crust is deep golden brown and the filling is bubbling through the vents.',
            'Cool on a wire rack for at least 2 hours before slicing — this allows the filling to set.']
            .map((step, i) => <li key={i} style={s.li}>{step}</li>)}
        </ol>
      </Section>

      <Section title="Tips &amp; Notes">
        <Tip><strong>Cold butter is key.</strong> The colder your butter, the flakier your crust. If your kitchen is warm, freeze the butter cubes for 15 minutes before using.</Tip>
        <Tip><strong>Apple variety matters.</strong> Granny Smith holds its shape and adds tartness; Honeycrisp adds sweetness. Avoid Red Delicious — they turn to mush.</Tip>
        <Tip><strong>Don't skip the rest.</strong> Cooling for 2 hours is not optional if you want clean slices. The cornstarch needs time to fully thicken the filling.</Tip>
      </Section>
    </Layout>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '36px' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f97316', marginBottom: '14px', paddingBottom: '6px', borderBottom: '2px solid #f7e4d4' }}>{title}</h3>
      {children}
    </div>
  );
}

function Tip({ children }) {
  return <div style={{ backgroundColor: '#f7f8fa', borderLeft: '4px solid #f97316', borderRadius: '0 6px 6px 0', padding: '14px 18px', fontSize: '0.9rem', color: '#57606a', marginTop: '8px' }}>{children}</div>;
}

const s = {
  header: { marginBottom: '32px' },
  title:  { fontSize: '2rem', fontWeight: 700, color: '#1f2328', marginBottom: '8px' },
  meta:   { display: 'flex', gap: '24px', flexWrap: 'wrap', fontSize: '0.88rem', color: '#57606a', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', padding: '12px 0', marginBottom: '32px' },
  list:   { paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' },
  li:     { fontSize: '0.95rem', lineHeight: 1.6, color: '#1f2328' },
  p:      { fontSize: '0.95rem', lineHeight: 1.7, color: '#1f2328' },
};
