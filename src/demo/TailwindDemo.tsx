import React from 'react'

export default function TailwindDemo() {
  return (
    <div className="w-full max-w-4xl mx-auto mt-12 space-y-8">
      <section className="bg-white text-gray-900 p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Typography (prose)</h2>
        <article className="prose lg:prose-xl">
          <h1>Voorbeeld artikel</h1>
          <p>
            Dit artikel toont de standaard typografiestijlen die de
            <code> @tailwindcss/typography</code> plugin toevoegt. Koppen,
            paragrafen, lijsten en blockquotes krijgen nette spacing en typografische
            keuzes out-of-the-box.
          </p>

          <h2>Subkop</h2>
          <p>
            Je kunt responsive varianten gebruiken zoals <code>prose</code>,
            <code>prose-lg</code> en <code>prose-xl</code>. Voor dark mode kun je
            <code>dark:prose-invert</code> toepassen op de wrapper.
          </p>

          <blockquote>
            Dit is een blockquote demonstratie — de plugin zorgt voor stijlvolle
            marges en afwijkende typography binnen quotes.
          </blockquote>

          <h3>Lijstvoorbeeld</h3>
          <ul>
            <li>Eerste punt</li>
            <li>Tweede punt</li>
            <li>Derde punt</li>
          </ul>

          <h3>Code</h3>
          <pre>
            <code>console.log('Hello Tailwind Typography')</code>
          </pre>
        </article>
      </section>

      <section className="bg-white text-gray-900 p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Formulieren (forms plugin)</h2>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            // demo only
            alert('Form submitted (demo)')
          }}
        >
          <div>
            <label className="block text-sm font-medium">Naam</label>
            <input type="text" className="mt-1 block w-full" placeholder="Jouw naam" />
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input type="email" className="mt-1 block w-full" placeholder="name@example.com" />
          </div>

          <div>
            <label className="block text-sm font-medium">Onderwerp</label>
            <select className="mt-1 block w-full">
              <option>Algemeen</option>
              <option>Feedback</option>
              <option>Bug</option>
            </select>
          </div>

          <div>
            <fieldset>
              <legend className="text-sm font-medium">Interesses</legend>
              <div className="mt-2 space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  <span>Nieuwsbrief</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  <span>Product updates</span>
                </label>
              </div>
            </fieldset>
          </div>

          <div>
            <label className="block text-sm font-medium">Bericht</label>
            <textarea rows={4} className="mt-1 block w-full" />
          </div>

          <div>
            <label className="block text-sm font-medium">Kies bestand</label>
            <input type="file" className="mt-1 block w-full" />
          </div>

          <div className="flex items-center gap-4">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded">Verstuur</button>
            <button type="button" className="px-4 py-2 border rounded" onClick={() => alert('Reset demo')}>
              Reset
            </button>
          </div>
        </form>
      </section>

      <section className="bg-white text-gray-900 p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Prose varianten & dark mode</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <article className="prose">
            <h3>Prose (default)</h3>
            <p>Kleine demo van de default <code>prose</code> styling.</p>
          </article>

          <article className="prose lg:prose-lg">
            <h3>Prose Large</h3>
            <p>Grotere typografie met <code>lg:prose-lg</code>.</p>
          </article>

          <article className="prose dark:prose-invert bg-gray-900 text-white p-4 rounded">
            <h3 className="text-white">Dark mode demo (prose-invert)</h3>
            <p className="text-gray-200">Gebruik <code>dark:prose-invert</code> binnen een dark wrapper.</p>
          </article>
        </div>
      </section>
    </div>
  )
}

