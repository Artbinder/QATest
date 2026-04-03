# Test Side Effects & Dependency Analysis

## Summary

| Category | Count | Tests |
|----------|-------|-------|
| READ-ONLY | 18 | T4001, T4175, T4177, T4222, T4236, T4237, T4244, T4245, T4247, T4248, T4253, T4271, T4273, T4274, T4275, T4276, T4280, T4290 |
| SELF-CLEANING | 7 | T4281, T4282, T4293, T4295, T4254, T4260, T4263 |
| CREATES-ONLY | 22 | T4000, T4172, T4173, T4174, T4185, T4210, T4211, T4212, T4238, T4239, T4240, T4243, T4288, T4289, T4294, T4296, T4297, T4321, T4322, T4329, T4330, T4347 |
| DELETES-ONLY | 5 | T4246, T4252, T4259, T4317, T4343 |
| MODIFIES-ONLY | 18 | T4167, T4168, T4169, T4170, T4171, T4186, T4213, T4214, T4249, T4257, T4258, T4262, T4277, T4278, T4279, T4283, T4338, T4345 |
| MIXED | 14 | T4261, T4291, T4292, T4296, T4319, T4320, T4326, T4340, T4341, T4342, T4344, T4355, T4356, T4357, T4358 |

---

## Critical Dependencies (Named Records That Must Exist)

These records are referenced by name across multiple tests. If any test deletes them, downstream tests break.

| Record Name | Type | Used By Tests |
|-------------|------|---------------|
| Swinging Cardinal | Object (Master) | T4238, T4296, T4338, T4343, T4344, T4345 |
| Georgica Association Wainscott, December 2013 | Object (Edition) | T4340, T4341, T4342 |
| White Noise | Object | T4001 |
| First Artist | Artist | T4210 |
| Charles Gaines | Artist | T4175 |
| Maxwell Adams | Contact | T4177, T4247 |
| Ankunding LLC | Contact Group | T4177 |
| Van Gogh | Show | T4175 |
| The Works | Show | T4239 |
| Big Ol List | List | T4175 |
| Landscape Assorted Trees With Regression #6 | Object | T4175 |
| Art Before Philosophy After Art | Object | T4276 |
| Editions Labels | Report Template | T4177 |
| Untitled (First the Dust...) | Object | T4168 |

---

## High-Risk Tests

### Tests That Delete First Item in a List (ORDER-DEPENDENT)
These delete whatever appears first, which could be a record another test needs:

| Test | What It Deletes | Risk |
|------|----------------|------|
| T4246 | First contact | Could delete Maxwell Adams (needed by T4177, T4247) |
| T4252 | First list (clicks Delete, no confirm) | Could delete Big Ol List (needed by T4175) |
| T4259 | First show (clicks Delete, no confirm) | Could delete Van Gogh/The Works (needed by T4175, T4239) |
| T4317 | First offer transaction | Could delete offers needed by other transaction tests |
| T4343 | Edition set of Swinging Cardinal | Breaks T4238, T4296, T4344, T4345 |

### Tests That Accumulate Records (No Cleanup)
These create records with `Date.now()` names that pile up over time:

| Test | Creates | Accumulation |
|------|---------|-------------|
| T4172 | Single Report Template | 1 per run |
| T4173 | Multi-Column Report Template | 1 per run |
| T4174 | Label Report Template | 1 per run |
| T4185 | Show (cancel + create) | 1 per run |
| T4210 | Object + image | 1 per run |
| T4211 | Object + image | 1 per run |
| T4212 | List (cancel + create) | 1 per run |
| T4243 | Contact | 1 per run |
| T4294 | Artist + address | 1 per run |
| T4347 | Edition Set (20 editions) | 20+ per run |

### Tests That Upload Files (Accumulate)
| Test | File | Target |
|------|------|--------|
| T4000 | 1.25.2024 (1).xlsx | Excel Importer (creates objects) |
| T4210 | 256x256bb.jpg | Object image |
| T4211 | 256x256bb.jpg | Object image |
| T4257 | bartleby.pdf | Show Supporting Docs |
| T4258 | 256x256bb.jpg | Show Images |
| T4278 | bartleby.pdf | Object Supporting Docs |
| T4288 | bartleby.pdf | Artist Press |
| T4289 | bartleby.pdf | Artist Bio |

---

## Dependency Flowchart

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRE-EXISTING ACCOUNT DATA                     │
│                                                                  │
│  Artists: Charles Gaines, First Artist, + others                │
│  Objects: Swinging Cardinal, White Noise, Georgica Assoc...,    │
│           Art Before Philosophy, Landscape Assorted Trees,       │
│           Untitled (First the Dust...)                           │
│  Shows: Van Gogh, The Works, + others                           │
│  Lists: Big Ol List, + others                                   │
│  Contacts: Maxwell Adams, + others                              │
│  Contact Groups: Ankunding LLC, + others                        │
│  Report Templates: Editions Labels, + others                    │
│  Transactions: Offers, Sales (with invoices)                    │
│  Forms: Consignments, Invoices, Loans                           │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│              PHASE 1: READ-ONLY TESTS (Safe, no side effects)    │
│                                                                   │
│  T4001 (search White Noise)     T4222 (contacts landing)         │
│  T4175 (search multiple)        T4236 (forms landing)            │
│  T4177 (search premium)         T4237 (invoices landing)         │
│  T4244 (contact group dialog)   T4245 (contact groups views)     │
│  T4247 (contact invoices)       T4248 (contact notes)            │
│  T4253 (list info)              T4271 (object selection LHM)     │
│  T4273 (objects landing)        T4274 (assoc invoices)           │
│  T4275 (assoc consignments)     T4276 (assoc reports)            │
│  T4280 (condition status)       T4290 (artist lists)             │
└──────────────────────────┬───────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│         PHASE 2: CREATION TESTS (Build test data)                │
│                                                                   │
│  T4000 (import Excel)           T4294 (create artist)            │
│  T4172 (single template)        T4173 (multi-col template)       │
│  T4174 (label template)         T4185 (create show)              │
│  T4210 (create object)          T4211 (create object from artist)│
│  T4212 (create list)            T4243 (create contact)           │
│  T4347 (create edition set)                                      │
│                                                                   │
│  ⚠️ These all accumulate records with no cleanup                 │
└──────────────────────────┬───────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│         PHASE 3: MODIFICATION TESTS (Change existing data)       │
│                                                                   │
│  T4167-T4171 (report exports)   T4186 (add to show)             │
│  T4213-T4214 (list objects)     T4238 (edition set forms)        │
│  T4239-T4240 (forms creation)   T4249 (add to group)            │
│  T4257-T4258 (show docs/images) T4262 (show add objects)        │
│  T4277 (add to list)            T4278 (supporting docs)          │
│  T4279 (financials)             T4283 (object editing)           │
│  T4296-T4297 (report exports)   T4338 (publishing)              │
│  T4345 (set info + location)                                     │
│                                                                   │
│  ⚠️ These modify records but don't revert                       │
└──────────────────────────┬───────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│     PHASE 4: SELF-CLEANING TESTS (Modify then revert)           │
│                                                                   │
│  T4254 (publish/unpublish list)  T4260 (publish/unpublish show) │
│  T4263 (shows LHM pub/unpub)    T4281 (location status reset)   │
│  T4282 (availability reset)     T4293 (create+delete artist)    │
│  T4295 (artists landing actions)                                 │
└──────────────────────────┬───────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│     PHASE 5: TRANSACTION TESTS                                   │
│                                                                   │
│  T4321 (create offer + add objects)                              │
│  T4322 (create offer transaction)                                │
│  T4329 (create sale + add objects)                               │
│  T4330 (create sale transaction)                                 │
│  T4319 (sale delete cancel)      T4320 (generate invoice)        │
│  T4326 (generate invoice)        T4317 (delete offer)            │
│  T4355-T4358 (consignment/invoice/loan details)                  │
│                                                                   │
│  ⚠️ T4317 deletes first offer — run LAST among transaction tests│
└──────────────────────────┬───────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│     PHASE 6: DESTRUCTIVE TESTS (Run last, delete records)        │
│                                                                   │
│  T4246 (delete first contact)                                    │
│  T4252 (delete first list)                                       │
│  T4259 (delete first show)                                       │
│  T4291 (dissociate show from artist)                             │
│  T4340 (edition delete dialog)                                   │
│  T4341 (master delete cancel)                                    │
│  T4343 (delete edition set)                                      │
│                                                                   │
│  ⚠️ These should run AFTER all tests that depend on those records│
└──────────────────────────────────────────────────────────────────┘
```

---

## Implemented Strategy: Import → Seed → Test → Full Wipe

### Pipeline Order
```
1. T4000 (Excel Import)     → Creates 60 objects + artists from Files/1.25.2024 (1).xlsx
2. 000-seed.spec.js         → Creates shows, lists, contacts, groups, templates, transactions, forms
3. T4001 - T4358            → All test cases run in numerical order
4. ZZZ-cleanup.spec.js      → Wipes ALL records from the account (complete reset)
```

### Deletion Order in Cleanup (respects dependencies)
1. Offer Transactions
2. Sale Transactions
3. Invoices
4. Consignments
5. Loans
6. Report Templates
7. Lists
8. Shows
9. Contact Groups
10. Contacts
11. Objects
12. Artists

### Files
- `tests/000-seed.spec.js` — Creates all non-import dependencies
- `tests/ZZZ-cleanup.spec.js` — Full account wipe after test run
