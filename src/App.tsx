import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TailwindDemo from './demo/TailwindDemo'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <div className="flex space-x-6">
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <h1 className="text-4xl font-bold mt-6">Vite + React + Tailwind</h1>

      <div className="mt-8 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl mb-4">Interactive</h2>
          <div className="card">
            <button
              className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500 focus:ring-4 focus:ring-indigo-300"
              onClick={() => setCount((count) => count + 1)}
            >
              count is {count}
            </button>
            <p className="mt-4 text-gray-300">
              Edit <code>src/App.tsx</code> and save to test HMR
            </p>
          </div>
        </section>

        <section className="bg-white text-gray-900 p-6 rounded-lg">
          <article className="prose lg:prose-lg">
            <h2>Artikel voorbeeld</h2>
            <p>
              Dit is een voorbeeld van de typography plugin. Koppen, paragrafen en lijsten krijgen nette
              standaard stijlen.
            </p>
            <ul>
              <li>Item één</li>
              <li>Item twee</li>
            </ul>
          </article>

          <form className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input type="email" placeholder="name@example.com" className="mt-1 block w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium">Bericht</label>
              <textarea rows={4} className="mt-1 block w-full"></textarea>
            </div>
            <div>
              <button type="submit" className="inline-block px-4 py-2 bg-indigo-600 text-white rounded">Verstuur</button>
            </div>
          </form>
        </section>
      </div>

      {/* Demo component met uitgebreide voorbeelden */}
      <div className="w-full max-w-6xl mt-10">
        <TailwindDemo />
      </div>

      <p className="read-the-docs mt-6 text-gray-400">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
