```mermaid
sequenceDiagram
  autonumber
  participant Creator as Creating User
  participant Other as Other User
  participant User as Target User
  participant Auction as Auction Service
  
  Creator ->> Auction: Create Auction
  activate Auction
  activate Creator

  Other ->> Auction: Bid on Auction (1cr)
  activate Other

  User ->> Auction: Bid on Auction (2cr)
  activate User

  Note over Auction: Auction Completes
  Note over User: Winner
  Note over Other: Loser

  rect rgba(255, 0, 0, .1)
    par Any Order. All Must Complete
      User ->> Auction: Collect Car
      deactivate User
    and
      Other ->> Auction: Collect Bid
      deactivate Other
    and
      Creator ->> Auction: Collect Sale Price
      deactivate Creator
    end
  end

    Note over Creator,Auction: (when all users collect)<br>Auction Finalized

  deactivate Auction

  loop
    Note over Auction: Background Processing<br>(run daily)
    Auction ->> Auction: Purge Finalized Auctions<br>(age: 24+ hours)
  end
  Note over Creator,Auction: Data Purged
```

# Stored data afterward
- auction id
- seller
- closing bid

# Wants
- Bid History
  - Who
  - How Much?
  - Buyout?
- Winners/losers/etc
- How much they paid?
- What they got?

# Timeline Proposal
- On All
  - (Index) Correlation ID of some sort (Auction ID?)
  - (Index) Who?
  - (Index) Date
  - Value / How Much?
  - Item?
- Auction Created
  - Starting Bid
  - Buyout Price (if available)
- Someone Bid (many such entries)
  - How much did they have *before/after* the bid?
  - Who *was* the leader?
  - Are they now the leader? (data consistency check)
- Buyout
  - How much did they pay?
  - How much did they have *before/after* the buyout?
- Auction Completed
  - Was it a buyout?
- Auction Collection
  - Winner? Loser? Creator?
  - What did they collect?
- Auction Finalized
  - What data got nuked?