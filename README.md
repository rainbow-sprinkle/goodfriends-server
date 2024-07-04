# Gaming Solution Server API.
## Required headers
HTTP Headers
1. 'GF-API-KEY': 'abcedef'
2. 'GF-AFFILIATE-CODE': 'abcde'

This is the value the client needs to communicate with the server.
The value for each client is different.
Please manage your affiliate code and API key through Sveltekit's env.

## Casino API
> Get casino list
- endpoint: /api/casino/list
- method: post
- data: search: {
    title: string,
    vendor: string[],
    type: string[],
    page: number
  }
- description : page starts at 0, and no object should have undefined.

#### response
````
//200
{
    list: [
        {
            idx: number,
            game_id: string,
            title: string,
            provider: string,
            thumnail: string,
            vendor: string,
            type: string,
            is_open: string,
            reg_date: string
        }
    ],
    totalNumber: number <- Number of total lists
}

//400
````
> Get filter menu
- endpoint: /api/casino/filter-menu
- method: post
- description: Brings up the Filters menu data.
````
//200
{
    type: [{name: string}],
    vendor: [{name: string}]
}

````

> Casino Launch
- endpoint: /api/casino/launch
- method: post
- data: idx(number)/, nick (string)

#### response
````
//200
{
    link: string
}

//400
````

> Get info
- endpoint: /api/casino/info
- method: post
- data: idx

#### response
````
//200
{
  title: string,
  thumbnail: string,
  vendor: string,
  type: string
}

//400
````

> Get bet result list
- endpoint: /api/casino/bet-result
- method: post

#### response
````
//200
[
    {
        title: string, 
        nick: string, 
        betAmount: number, 
        profitAmount: number
    }
]
````
