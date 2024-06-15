const OpenAI = require('openai');
const { OPENAI_API_KEY } = require('../config.js');

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY
});

const getPersonalizedRecommendations = async (userRankings) => {
    console.log(userRankings);
    const prompt = `
        En base a estos rankigs de peliculas: ${JSON.stringify(userRankings)}, sugiere otras peliculas que le podrían gustar al usuario.
        Considera lo siguiete:
        - Si una película tiene un ranking de 1 o 2, NO recomiendes peliculas del mismo género o tema, recomienda de cualquier otro.
        - Si una película tiene un ranking de 4 o 5, recomienda más películas del mismo género o tema.
        - Si una película tiene un ranking de 3, puedes recomendar películas del mismo género o explorar otros géneros.
        - La escala de ranking va desde 1 a 5, donde 1 es mala y 5 es buena.
        Por favor, lista las recomendaciones en formato JSON con el siguiente formato:
        [
            {"Recommendation": "Motivo de la recomendación, el porque de tu recomendación, basada en los rankings de las películas (NO RECOMIENDES PELICULAS QUE YA ESTAN EN LOS RANKINGS)"},
            {"title": "Movie Title 1", "description": "Short description 1"},
            {"title": "Movie Title 2", "description": "Short description 2"},
            ...
        ]
    `;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "Eres un experto en peliculas, y ayudas a recomendar películas." },
                { role: "user", content: prompt }
            ]
        });

        const recommendations = JSON.parse(completion.choices[0].message.content);
        return recommendations;
    } catch (error) {
        console.error('Error fetching recommendations from GPT:', error);
        throw error;
    }
};

const handleRecommendations = async (req, res) => {
    const { userRankings } = req.body;
    //console.log("User rankings: ", userRankings);
    try {
        const recommendations = await getPersonalizedRecommendations(userRankings);
        res.json(recommendations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const methods = {
    handleRecommendations
};

module.exports = {
    methods
};