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
     if(responseBody.errors) {
          throw new Error(responseBody.errors.map((error)=>error.message).join("\n"));
     }
     return responseBody.data;
 }

 export async function loadCompany(id) {
     console.log('company called');
     
     const query = `query companyQuery($id: ID!){
        company(id: $id) {
          id,
          name,
          description
          jobs {
              id,
              title
          }
        }
      }`;
      const {company} = await graphqlRequest(query, {id});
      return company;
 }