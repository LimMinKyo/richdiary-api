# Rich Diary
> Generated by [`prisma-markdown`](https://github.com/samchon/prisma-markdown)

- [부자일기](#부자일기)

## 부자일기
```mermaid
erDiagram
"User" {
  String id PK
  DateTime createdAt
  DateTime updatedAt
  String name
  String email UK
  String password "nullable"
  Provider provider
  Boolean verified
}
"Verification" {
  String id PK
  DateTime createdAt
  DateTime updatedAt
  String code
  String userId FK
}
"Portfolio" {
  String id PK
  DateTime createdAt
  DateTime updatedAt
  String name
  String userId FK
}
"Dividend" {
  String id PK
  DateTime createdAt
  DateTime updatedAt
  DateTime dividendAt
  String name
  Unit unit
  Float dividend
  Float tax
  String userId FK
  String portfolioId FK "nullable"
}
"StockRecord" {
  String id PK
  DateTime createdAt
  DateTime updatedAt
  DateTime recordAt
  String companyName
  Float quantity
  Unit unit
  Float buyPrice
  Float currentPrice
  String userId FK
}
"Exchange" {
  DateTime createdAt
  DateTime updatedAt
  String date
  Unit currency
  Float rate
}
"Verification" |o--|| "User" : user
"Portfolio" }o--|| "User" : user
"Dividend" }o--|| "User" : user
"Dividend" }o--o| "Portfolio" : portfolio
"StockRecord" }o--|| "User" : user
```

### `User`

**Properties**
  - `id`: 
  - `createdAt`: 
  - `updatedAt`: 
  - `name`: 
  - `email`: 
  - `password`: Provider가 LOCAL이 아닐 경우 null
  - `provider`: 
  - `verified`: 

### `Verification`

**Properties**
  - `id`: 
  - `createdAt`: 
  - `updatedAt`: 
  - `code`: 
  - `userId`: 

### `Portfolio`

**Properties**
  - `id`: 
  - `createdAt`: 
  - `updatedAt`: 
  - `name`: 
  - `userId`: 

### `Dividend`

**Properties**
  - `id`: 
  - `createdAt`: 
  - `updatedAt`: 
  - `dividendAt`: 
  - `name`: 
  - `unit`: 
  - `dividend`: 
  - `tax`: 
  - `userId`: 
  - `portfolioId`: 

### `StockRecord`

**Properties**
  - `id`: 
  - `createdAt`: 
  - `updatedAt`: 
  - `recordAt`: 
  - `companyName`: 
  - `quantity`: 
  - `unit`: 
  - `buyPrice`: 
  - `currentPrice`: 
  - `userId`: 

### `Exchange`

**Properties**
  - `createdAt`: 
  - `updatedAt`: 
  - `date`: 
  - `currency`: 
  - `rate`: 