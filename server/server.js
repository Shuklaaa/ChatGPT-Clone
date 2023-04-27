import express from 'express';
import * as dotenv from 'dotenv';  //dotenv reads key value pairs from the .env file and can set them as environment variables
import cors from 'cors'; //allows us to make cross origin requests
import { Configuration , OpenAIApi } from 'openai';

dotenv.config();  //loads environment variables from .env file

// console.log(process.env.OPENAI_API_KEY)

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());  //allows us to send json from froentend to backend

app.get('/', async(req, res) => {     //basic response from server
    res.status(200).send({                 //A Promise is a proxy for a value not necessarily known
        message: 'Hello from this side',   //async makes promises easier to write
    })
});

app.post('/', async(req, res) => {
    try{
        const prompt = req.body.prompt;

        const response = await openai.createCompletion({  //await is usually used to unwrap promises by passing a Promise as the expression
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0,   //a parameter of OpenAI ChatGPT, GPT-3 and GPT-4 models that governs the randomness and thus the creativity of the responses
            max_tokens: 3000,  //The maximum number of tokens to generate in the completion.
            top_p: 1,  // top_p determines the proportion of the most likely word choices the model should consider when generating text
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });;

        res.status(200).send({
            bot: response.data.choices[0].text   //choices[0] becaus it gives a large set of answer array from where we have to only get the first one as it is the most relevant one.
        })
    } catch (error){
        console.log(error);
        res.status(500).send({ error })
    }
})

app.listen(5000, () => console.log('Server is running on port http://localhost:5000'));