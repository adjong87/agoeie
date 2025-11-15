import { Link } from 'react-router-dom';

export default function HomePage() {
    return (
        <div className="max-w-4xl mx-auto text-center py-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Wolkom by A Goeie! 🎓
            </h1>
            <p className="text-xl text-gray-600 mb-8">
                Leer Fries op jouw eigen tempo met interactieve lessen en oefeningen
            </p>

            <div className="grid md:grid-cols-3 gap-6 mt-12">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="text-4xl mb-4">📚</div>
                    <h3 className="text-xl font-semibold mb-2">Interactieve Lessen</h3>
                    <p className="text-gray-600">
                        Leer grammatica en vocabulaire met gestructureerde lessen
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="text-4xl mb-4">✍️</div>
                    <h3 className="text-xl font-semibold mb-2">Gevarieerde Oefeningen</h3>
                    <p className="text-gray-600">
                        Oefen met multiple choice, fill-in, en meer
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="text-4xl mb-4">📊</div>
                    <h3 className="text-xl font-semibold mb-2">Volg je Voortgang</h3>
                    <p className="text-gray-600">
                        Zie je ontwikkeling met gedetailleerde statistieken
                    </p>
                </div>
            </div>

            <Link
                to="/lessons"
                className="inline-block mt-12 px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-lg hover:bg-indigo-700 transition"
            >
                Start met Leren →
            </Link>
        </div>
    );
}