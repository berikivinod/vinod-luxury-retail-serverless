exports.handler = async () => {

  console.log(
    "VLR RAG Indexer Lambda invoked"
  );

  return {
    statusCode: 200,

    body: JSON.stringify({
      message:
        "VLR RAG Indexer Lambda is working"
    })
  };

};