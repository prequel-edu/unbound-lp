// build-variants.mjs
// Generates the 3 LP variants from /tmp/unbound-lp/index.html
// Run: node build-variants.mjs

import fs from "node:fs";
import path from "node:path";

const SRC = "/tmp/unbound-lp/index.html";
const baseHtml = fs.readFileSync(SRC, "utf8");

const VARIANTS = {
  "human-centric": {
    lp_variant: "human_centric",
    title: "Unbound Academy — Real Teachers. Real Time.",
    meta_description: "Real Arizona-certified teachers, daily 1:1 check-ins, live class time. Tuition-free virtual charter school for grades 4–8.",
    hero_eyebrow: "Arizona · Grades 4–8 · Tuition-Free Charter School",
    // Single-line hero with inline green accent on "Real time."
    hero_h1_html: `<h1 class="disp d1">Real teachers. <span style="color:var(--green)">Real time.</span></h1>`,
    hero_sub: "At Unbound Academy, your child is <strong>known, supported, and taught by real Arizona-certified teachers</strong> who meet with them every day. Our 2-Hour Learning model blends human connection with smart AI tools — freeing teachers to give more 1:1 attention and helping students learn faster, not lonelier.",
    cta_hero: "Enroll Now",
    cta_sticky: "Enroll Now →",
    cta_final_label: "Apply Today",
    cta_final_btn: "Enroll Now →",
    form_h2_word: "live-teacher learning",
    form_pitch: "Real Arizona-certified teachers, on screen with your child every day. Live class time, daily 1:1 check-ins, and real academic help when they get stuck. See if Unbound is the right fit for your family.",
    form_quote_text: "When my mom brought it up to me first, I was hesitant because I didn't want to start over. But once I started, I realized this is a school for me.",
    form_quote_by: "Elijah, Unbound student",
    axis_spotlight_eyebrow: "Inside a Day at Unbound",
    axis_spotlight_h2: "Your child is never alone.",
    axis_spotlight_body: "Unbound is the most interactive virtual school with high levels of teacher-student engagement. Live class sessions, daily 1:1 teacher check-ins, real academic help when students get stuck, and every teacher is Arizona-certified.",
    axis_spotlight_pull_quote: "My child went from struggling to thriving in just a few months.",
    axis_spotlight_pull_quote_by: "Unbound Academy parent",
    final_cta_h2: "Let's See If Unbound's the Right Fit.",
    final_cta_p: "Real teachers. Real time. A school that treats your child like a person, not a number.",
    testy_order: ["rochelle","breanna","lauren"],
  },
  "ai-driven": {
    lp_variant: "ai_driven",
    title: "Unbound Academy — AI-Powered Learning. Real Teachers at the Center.",
    meta_description: "Arizona's most advanced AI-powered tuition-free charter school for grades 4–8. Real teachers + personalized AI tutoring. 2.8× faster learning measured by MAP.",
    hero_eyebrow: "Arizona · Grades 4–8 · Tuition-Free Charter School",
    hero_h1_html: `<h1 class="disp d1">AI-powered learning.</h1>
      <h1 class="disp d1" style="color:var(--green)">Real teachers at the center.</h1>`,
    hero_sub: "Unbound Academy uses <strong>advanced AI to tailor every lesson</strong> while teachers lead, guide, and mentor daily. Students finish academics in 2 hours, then join live workshops with peers to build skills for the real world.",
    hero_stat_html: `<div class="hero-stat">
        <div class="hero-stat-big">2.8×</div>
        <div class="hero-stat-text"><strong>Faster learning growth</strong><br>vs. national average, measured by NWEA MAP</div>
      </div>`,
    cta_hero: "Enroll Now",
    cta_sticky: "Enroll Now →",
    cta_final_label: "Get Started",
    cta_final_btn: "Enroll Now →",
    form_h2_word: "personalized learning",
    form_pitch: "Personalized AI tutoring meets every student where they are. Real teachers lead the day. Academics done in 2 hours, measured by MAP — 2.8× faster than the national average. See how it works.",
    form_quote_text: "I'm a real teacher at one of these so-called AI schools. We're not replacing teachers — I've never had more time to actually teach.",
    form_quote_by: "Zack, Unbound Academy teacher",
    axis_spotlight_eyebrow: "How Learning Works at Unbound",
    axis_spotlight_h2: "Every student. Every subject. Their exact level.",
    axis_spotlight_body: "Every Unbound student is <strong>assessed in each subject</strong> at the start of the year — and works at the <strong>appropriate grade level for that subject</strong>. A student can be <strong>ahead in math and behind in reading</strong>; the curriculum adapts in each. <strong>Students who are behind catch up.</strong> <strong>Students who are ahead keep progressing</strong> at their own faster pace, never held back. While AI handles practice and pacing, real teachers run live classes, 1:1 check-ins, and afternoon workshops. The result: <strong>mastery, not memorization</strong>. <strong>2.8× faster growth on MAP.</strong>",
    axis_spotlight_pull_quote: "AI handles the busy work. I get to work one-on-one with my students, lead live workshops, and help them build real projects they actually care about.",
    axis_spotlight_pull_quote_by: "Zack, Unbound Academy teacher",
    final_cta_h2: "See How Personalized Learning Works.",
    final_cta_p: "Personalized academics in 2 hours, taught by real teachers. The most innovative tuition-free charter school in Arizona.",
    testy_order: ["lauren","rochelle","breanna"],
  },
  "life-skills": {
    lp_variant: "life_skills",
    title: "Unbound Academy — 2 Hours of Academics. Afternoons for Life.",
    meta_description: "Tuition-free virtual charter for grades 4–8. Core academics 8–11 AM, life-skills workshops 12–2 PM. Entrepreneurship, financial literacy, public speaking, and more.",
    hero_eyebrow: "Arizona · Grades 4–8 · Tuition-Free Charter School",
    hero_h1_html: `<h1 class="disp d1">2 hours of academics.</h1>
      <h1 class="disp d1" style="color:var(--green)">Afternoons for life.</h1>`,
    hero_sub: "At Unbound Academy, students <strong>master core academics in just 2 hours</strong> with AI-personalized learning — then spend their afternoons in live life-skills workshops. From entrepreneurship and financial literacy to public speaking and grit, students learn from real teachers and collaborate with real classmates every day.",
    cta_hero: "Enroll Now",
    cta_sticky: "Enroll Now →",
    cta_final_label: "Get Started",
    cta_final_btn: "Enroll Now →",
    form_h2_word: "real-world skills education",
    form_pitch: "Focus on core academics in the morning and our afternoons are spent building businesses, learning to invest, mastering public speaking, writing books. The skills your child will actually use that traditional school never teaches.",
    form_quote_text: "We did business builders where we started a business and tried to earn $50. I'm actually going to use this in the future. There's a lot more life skills we're going to use.",
    form_quote_by: "Unbound Academy student",
    axis_spotlight_eyebrow: "",
    axis_spotlight_h2: "School isn't just about grades.",
    axis_spotlight_body: "8 AM to 11 AM: core academics. Math, reading, science, and writing, each at your child's actual grade level. 12 PM to 2 PM: live life-skills workshops. Entrepreneurship, financial literacy, public speaking, and grit, taught by real teachers and built around real outcomes. Traditional school spends 6 to 8 hours on academics alone. Unbound spends 2 hours mastering them, then 2 hours on the skills your child will actually use.",
    axis_spotlight_pull_quote: "They're getting to apply actual life skills — entrepreneurship, grit, financial literacy — things they'd never get in a regular middle school.",
    axis_spotlight_pull_quote_by: "Unbound Academy teacher",
    final_cta_h2: "Apply Today. Build Something Real.",
    final_cta_p: "2 hours of academics. Afternoons for the skills your child will actually use. Tuition-free, Arizona-based, grades 4–8.",
    testy_order: ["breanna","rochelle","lauren"],
  },
};

const TESTIMONIALS = {
  rochelle: `      <div class="testy-card">
        <div class="testy-photo">
          <img src="../images/Screenshot-2025-07-11-at-2.19.17-PM.png" alt="Rochelle, Unbound Mom" onerror="this.parentElement.style.background='#1a1a1a'" />
        </div>
        <div class="testy-body">
          <div class="testy-ql">"Our son trains five days a week and still thrives academically."</div>
          <div class="testy-p">We're a sports family. At every other school, our son was constantly choosing between learning and doing what he loves. Unbound eliminated that choice entirely. He thrives academically AND athletically now.</div>
          <div class="testy-by">Rochelle R. · Chandler, AZ</div>
        </div>
      </div>`,
  breanna: `      <div class="testy-card">
        <div class="testy-photo">
          <img src="../images/Screenshot-2025-07-11-at-2.19.42-PM.png" alt="Breanna, Unbound Mom" onerror="this.parentElement.style.background='#1a1a1a'" />
        </div>
        <div class="testy-body">
          <div class="testy-ql">"Two hours of focused learning. The rest? Real life."</div>
          <div class="testy-p">Our boys finish core academics in just two hours a day, then spend the rest on real-world skills. The small class sizes, supportive environment, and emphasis on life readiness made this a clear winner.</div>
          <div class="testy-by">Breanna L. · Tucson, AZ</div>
        </div>
      </div>`,
  lauren: `      <div class="testy-card">
        <div class="testy-photo">
          <img src="../images/Screenshot-2025-07-11-at-2.30.27-PM.png" alt="Lauren, Unbound Mom" onerror="this.parentElement.style.background='#1a1a1a'" />
        </div>
        <div class="testy-body">
          <div class="testy-ql">"The traditional education system is long overdue for a change."</div>
          <div class="testy-p">As a parent who believes in AI and modern education, Unbound was an easy decision. We travel frequently, so the flexible approach is a perfect fit. The business and tech courses are crucial for my child's future.</div>
          <div class="testy-by">Lauren S. · Mesa, AZ</div>
        </div>
      </div>`,
};

function buildVariant(slug, v) {
  let html = baseHtml;

  // 1. Title + meta description
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${v.title}</title>`);
  html = html.replace(
    /<meta name="description" content="[^"]*"\s*\/>/,
    `<meta name="description" content="${v.meta_description}" />`
  );

  // 2. noindex robots + lp_variant marker
  html = html.replace(
    /<meta name="description" content="[^"]*"\s*\/>/,
    (m) => `${m}\n  <meta name="robots" content="noindex, nofollow" />\n  <meta name="lp_variant" content="${v.lp_variant}" />`
  );

  // 3. Self-canonical to variant
  html = html.replace(
    /<link rel="canonical" href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="https://join.unbound.school/${slug}/" />`
  );

  // 4. Fix asset paths
  html = html.replace(/url\('fonts\//g, "url('../fonts/");
  html = html.replace(/src="videos\//g, 'src="../videos/');
  html = html.replace(/src="images\//g, 'src="../images/');
  html = html.replace(/src="photos\//g, 'src="../photos/');

  // 5. Hero eyebrow
  html = html.replace(
    /<div class="hero-eyebrow">[^<]*<\/div>/,
    `<div class="hero-eyebrow">${v.hero_eyebrow}</div>`
  );

  // 6. Hero H1 — replace baseline 2-line block with variant-supplied HTML (1 or 2 lines)
  html = html.replace(
    /<h1 class="disp d1">Academics in 2 Hours\.<\/h1>\s*<h1 class="disp d1" style="color:var\(--green\)">Afternoons for the<br>skills that shape them\.<\/h1>/,
    v.hero_h1_html
  );

  // 7. Hero sub
  html = html.replace(
    /<p class="hero-sub">[\s\S]*?<\/p>/,
    `<p class="hero-sub">${v.hero_sub}</p>`
  );

  // 8. Hero primary CTA
  html = html.replace(
    /<button class="btn-primary" onclick="document\.getElementById\('apply'\)\.scrollIntoView\(\{behavior:'smooth'\}\)">\s*Enroll Now\s*<svg/,
    `<button class="btn-primary" onclick="document.getElementById('apply').scrollIntoView({behavior:'smooth'})">\n        ${v.cta_hero}\n        <svg`
  );

  // 8b. Optional hero stat badge (variant-specific) — inserted between CTA and hero-pills
  if (v.hero_stat_html) {
    html = html.replace(
      /(<\/svg>\s*<\/button>)\s*(<div class="hero-pills">)/,
      `$1\n\n      ${v.hero_stat_html}\n\n      $2`
    );
  }

  // 9. Form section h2 word swap + pitch
  html = html.replace(
    /Tuition-free virtual school for <span style="background:var\(--black\);color:var\(--green\);padding:0 6px;display:inline">grades 4–8<\/span>/,
    `Tuition-free virtual ${v.form_h2_word} for <span style="background:var(--black);color:var(--green);padding:0 6px;display:inline">grades 4–8</span>`
  );
  html = html.replace(
    /<p>Guided by real teachers and AI, Unbound students master academics in 2 focused hours, then spend afternoons building real-world skills\. See if Unbound is the right fit for your family\.<\/p>/,
    `<p>${v.form_pitch}</p>`
  );

  // 10. Form side-quote
  html = html.replace(
    /<div class="side-quote">\s*<div class="qt">"Two hours of focused learning\. The rest\? Real life\. Our boys finish core academics in just two hours a day\."<\/div>\s*<div class="qb">Breanna L\., Unbound Mom · Tucson, AZ<\/div>\s*<\/div>/,
    `<div class="side-quote">\n          <div class="qt">"${v.form_quote_text}"</div>\n          <div class="qb">${v.form_quote_by}</div>\n        </div>`
  );

  // 11. Hidden lp_variant input
  html = html.replace(
    /(<input type="hidden" name="utm_source"[\s\S]*?\/>)/,
    `<input type="hidden" name="lp_variant" id="f_lp_variant" value="${v.lp_variant}" />\n            $1`
  );

  // 12. Insert axis-spotlight section BEFORE benefits section. Eyebrow rendered only if non-empty.
  const eyebrowHtml = v.axis_spotlight_eyebrow
    ? `<div class="lbl-light" style="justify-content:center">${v.axis_spotlight_eyebrow}</div>\n      `
    : "";
  const axisSpotlightHtml = `
<!-- ════════════════════════════════
     AXIS SPOTLIGHT — ${slug} (variant-specific)
════════════════════════════════ -->
<section style="background:var(--off2);padding:80px 0;border-top:1px solid var(--border-l);border-bottom:1px solid var(--border-l)">
  <div class="c">
    <div style="max-width:760px;margin:0 auto;text-align:center">
      ${eyebrowHtml}<h2 class="disp d2" style="color:var(--ink);margin-bottom:18px">${v.axis_spotlight_h2}</h2>
      <p class="axis-body" style="font-size:17px;color:var(--ink2);line-height:1.75;margin-bottom:32px">${v.axis_spotlight_body}</p>
      <style>.axis-body strong{color:var(--ink);font-weight:700}</style>
      <div style="background:#fff;border-left:3px solid var(--green);padding:24px 28px;text-align:left;border-radius:0 8px 8px 0;box-shadow:0 1px 4px rgba(0,0,0,.04);max-width:640px;margin:0 auto">
        <p style="font-size:16px;font-style:italic;color:var(--ink2);line-height:1.7;margin-bottom:10px">"${v.axis_spotlight_pull_quote}"</p>
        <p style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:#999">${v.axis_spotlight_pull_quote_by}</p>
      </div>
    </div>
  </div>
</section>

<!-- ════════════════════════════════
     BENEFITS — light, 3 cards
════════════════════════════════ -->`;
  html = html.replace(
    /<!-- ════════════════════════════════\s*\n\s*BENEFITS — light, 3 cards\s*\n\s*════════════════════════════════ -->/,
    axisSpotlightHtml
  );

  // 13. Testimonials reorder
  const orderedTestimonials = v.testy_order.map((k) => TESTIMONIALS[k]).join("\n");
  html = html.replace(
    /<div class="testy-grid" id="testyGrid">[\s\S]*?<\/div>\s*<div class="mob-carousel-nav">[\s\S]*?testy-photo img/,
    (m) => {
      const navStart = m.indexOf('<div class="mob-carousel-nav">');
      const trailer = m.slice(navStart);
      return `<div class="testy-grid" id="testyGrid">\n${orderedTestimonials}\n    </div>\n    ${trailer}`;
    }
  );

  // 14. Final CTA section
  html = html.replace(
    /<section class="cta-sec">\s*<div class="c">\s*<div class="lbl-cta">Apply Today<\/div>\s*<h2 class="disp d2">It's Time to Find Out\.<\/h2>\s*<p>Spots are limited each term\. Takes less than 2 minutes to get started\.<\/p>\s*<button class="btn-dark" onclick="document\.getElementById\('apply'\)\.scrollIntoView\(\{behavior:'smooth'\}\)">Enroll Now →<\/button>\s*<p class="cta-note">Arizona · Grades 4–8 · Fully Funded<\/p>\s*<\/div>\s*<\/section>/,
    `<section class="cta-sec">
  <div class="c">
    <div class="lbl-cta">${v.cta_final_label}</div>
    <h2 class="disp d2">${v.final_cta_h2}</h2>
    <p>${v.final_cta_p}</p>
    <button class="btn-dark" onclick="document.getElementById('apply').scrollIntoView({behavior:'smooth'})">${v.cta_final_btn}</button>
    <p class="cta-note">Arizona · Grades 4–8 · Fully Funded</p>
  </div>
</section>`
  );

  // 15. Sticky mobile CTA
  html = html.replace(
    /<div class="sticky-cta">\s*<button onclick="document\.getElementById\('apply'\)\.scrollIntoView\(\{behavior:'smooth'\}\)">Enroll Now →<\/button>\s*<\/div>/,
    `<div class="sticky-cta">\n  <button onclick="document.getElementById('apply').scrollIntoView({behavior:'smooth'})">${v.cta_sticky}</button>\n</div>`
  );

  // 16. Form submit: append lp_variant to fields
  html = html.replace(
    /\{ name:'grade_eligibility',value:grade\s*\},/,
    `{ name:'grade_eligibility',value:grade },\n    { name:'lp_variant',value:'${v.lp_variant}' },`
  );

  // 17. Redirect URL: append lp_variant
  html = html.replace(
    /params\.push\('grade=' \+ encodeURIComponent\(grade \|\| ''\)\);/,
    `params.push('grade=' + encodeURIComponent(grade || ''));\n  params.push('lp_variant=${v.lp_variant}');`
  );

  return html;
}

for (const [slug, v] of Object.entries(VARIANTS)) {
  const dir = path.join(path.dirname(SRC), slug);
  fs.mkdirSync(dir, { recursive: true });
  const out = path.join(dir, "index.html");
  fs.writeFileSync(out, buildVariant(slug, v));
  const size = fs.statSync(out).size;
  console.log(`✓ ${slug}/index.html  (${size} bytes)`);
}
console.log("\nDone.");
