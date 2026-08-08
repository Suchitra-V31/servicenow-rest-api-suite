# ServiceNow Incident Management REST API

A complete Scripted REST API suite built on ServiceNow 
(Australia release) for incident lifecycle management.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /incident/create | Create a new incident |
| GET | /incident/{number} | Fetch incident by number |
| PUT | /incident/{number}/assign | Assign to group/agent |
| GET | /incident/stats | Active incident statistics |

## Tech Stack
- ServiceNow Scripted REST API
- GlideRecord, GlideAggregate
- JavaScript (ES5 — ServiceNow compatible)

## How to Use
1. Import the Update Set XML into any ServiceNow instance
2. Import the Postman collection
3. Set your instance URL + Basic Auth credentials in Postman
4. Run the collection

## Business Use Case
Enables external systems to create, query, assign and 
monitor incidents via REST — bypassing the ServiceNow 
UI for automated workflows.
