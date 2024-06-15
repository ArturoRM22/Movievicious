// __tests__/recommendations.test.js
const OpenAI = require('openai');
const { methods } = require('../src/controllers/ai.Service.js');
const { handleRecommendations } = methods;

jest.mock('openai', () => {
  return {
    chat: {
      completions: {
        create: jest.fn()
      }
    }
  };
});

const mockRequest = (body) => ({
  body
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('handleRecommendations', () => {
  it('should return recommendations based on user rankings', async () => {
    const userRankings = [
      { title: "Movie 1", ranking: 5 },
      { title: "Movie 2", ranking: 2 }
    ];

    const mockOpenAIResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify([
              { Recommendation: "Recommendation reason", title: "Recommended Movie 1", description: "Description 1" },
              { title: "Recommended Movie 2", description: "Description 2" }
            ])
          }
        }
      ]
    };

    OpenAI.chat.completions.create.mockResolvedValueOnce(mockOpenAIResponse);

    const req = mockRequest({ userRankings });
    const res = mockResponse();

    await handleRecommendations(req, res);

    expect(OpenAI.chat.completions.create).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith([
      { Recommendation: "Recommendation reason", title: "Recommended Movie 1", description: "Description 1" },
      { title: "Recommended Movie 2", description: "Description 2" }
    ]);
  });

  it('should return a 500 error if the OpenAI API call fails', async () => {
    OpenAI.chat.completions.create.mockRejectedValueOnce(new Error('API Error'));

    const req = mockRequest({ userRankings: [] });
    const res = mockResponse();

    await handleRecommendations(req, res);

    expect(OpenAI.chat.completions.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'API Error' });
  });
});
