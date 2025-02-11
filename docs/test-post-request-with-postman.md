# Testing the POST Request with Postman

To test the POST request with Postman, follow these steps:

1. Open Postman.
2. Create a new POST request.
3. Set the URL to `https://project03-rj91.onrender.com/store-token`.
4. In the "Body" tab, select "raw" and set the format to "JSON".
5. Add the JSON payload with `userId` and `token` fields.
6. Send the request and check the response.

## Example JSON Payload

```json
{
    "userId": "exampleUserId",
    "token": "exampleToken"
}
```
