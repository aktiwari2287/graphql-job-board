const endpointURL = 'http://localhost:9000/graphql';

export async function loadJobs() {
   const query = `
                query {
                    jobs {
                    id,
                    title,
                    company {
                        id,
                        name,
                        description
                    }
                    } 
                }                
                `;
    const {jobs} = await graphqlRequest(query);
    return jobs;
}


export async function loadJobsById(id) {
    const query =`
             query JobQuery($id: ID!) {
                job(id: $id){
                 id,
                 title,
                 description,
                 company{
                   id,
                   name
                 }
               }
             }              
                 `;
     const {job} = await graphqlRequest(query,{id});
     return job;
 }


 export async function graphqlRequest(query, variables={}) {
    const response = await fetch(endpointURL, {
         method: 'POST',
         headers: {
             'content-type': 'application/json'   
         },
         body: JSON.stringify({query,variables})
     });
     const responseBody = await response.json();
     return responseBody.data;
 }