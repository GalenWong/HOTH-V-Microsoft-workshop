const jimp = require('jimp');
const request = require('request');

const apiKey = "f3dc59ceeab84e2fb3175742b819c736";

const apiURL = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect';

const imageAddress = "https://scontent-lax3-1.xx.fbcdn.net/v/t31.0-8/29354906_2056684117704988_4508172241824379264_o.jpg?_nc_cat=108&_nc_ht=scontent-lax3-1.xx&oh=1eedaeb4a841ceaca039163b32832387&oe=5C7A2C63";

function pikachuize(
    imageURL,
    savePath,
    pikachuPath
) {
    // body of the request 
    const body = {
        url: imageURL, 
    };

    const httpRequest = {
        uri: apiURL,
        body: JSON.stringify(body), // converting JavaScript object to a string
        // header of the request
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': apiKey
        }
    };

    // make request, forward the response and response body to the async function
    request.post(httpRequest, async (err, response, body) => {
        if(err) {
            console.log('Error: ', err);
            return;
        }
        // this is suppose to be an array
        let jsonResponse = JSON.parse(body);

        let image = await jimp.read(imageURL);
        for(let i = 0; i < jsonResponse.length; i++) {
            const face = jsonResponse[i].faceRectangle;
            const height = face.height;
            const width = face.width;
            const top = face.top;
            const left = face.left;
            const pika = await jimp.read(pikachuPath);
            pika.resize(width, height);
            image.composite(pika, left, top);
        }

        image.write(savePath);
    });
}


pikachuize(imageAddress, 'output.png', 'pikachu.png');