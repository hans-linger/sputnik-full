export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  Decimal: { input: any; output: any; }
  JSON: { input: any; output: any; }
  JSONObject: { input: any; output: any; }
  NaiveDateTime: { input: any; output: any; }
  UUID: { input: any; output: any; }
};

export type AttributeFilter = {
  filters: Array<DataFilter>;
  operator?: InputMaybe<EventAttributeFilterOperator>;
};

export type AttributeMessageFilter = {
  filters: Array<MessageDataFilter>;
  operator?: InputMaybe<EventAttributeFilterOperator>;
};

export enum AuctionEndPreset {
  Next_1Hour = 'NEXT_1_HOUR',
  Next_6Hours = 'NEXT_6_HOURS',
  Next_7Days = 'NEXT_7_DAYS',
  Next_24Hours = 'NEXT_24_HOURS',
  Next_48Hours = 'NEXT_48_HOURS'
}

export type Block = {
  __typename?: 'Block';
  blockHeight: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  /** Internal UUID, might change between when the indexer is reran. */
  id: Scalars['ID']['output'];
};

export type BlockConnection = {
  __typename?: 'BlockConnection';
  edges: Array<BlockEdge>;
  pageInfo: PageInfo;
};

export type BlockEdge = {
  __typename?: 'BlockEdge';
  cursor: Scalars['String']['output'];
  node: Block;
};

export enum BlockSortBy {
  BlockHeightAsc = 'BLOCK_HEIGHT_ASC',
  BlockHeightDesc = 'BLOCK_HEIGHT_DESC'
}

/** Sort */
export enum CollectionSortBy {
  MintedAtAsc = 'MINTED_AT_ASC',
  MintedAtDesc = 'MINTED_AT_DESC',
  TokensCountAsc = 'TOKENS_COUNT_ASC',
  TokensCountDesc = 'TOKENS_COUNT_DESC',
  Volume_7DDesc = 'VOLUME_7D_DESC',
  Volume_24HDesc = 'VOLUME_24H_DESC'
}

export type ContractDataFilter = {
  name: Scalars['String']['input'];
  operator?: InputMaybe<ContractDataFilterOperator>;
  type: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export enum ContractDataFilterOperator {
  Equal = 'EQUAL',
  Greater = 'GREATER',
  GreaterOrEqual = 'GREATER_OR_EQUAL',
  Lower = 'LOWER',
  LowerOrEqual = 'LOWER_OR_EQUAL'
}

/** Contract filter */
export type ContractFilter = {
  /** Contract type: example: 'crates.io:sg-721` */
  contractType: Scalars['String']['input'];
  events: Array<ContractFilterEvent>;
};

/** Event name and optional action */
export type ContractFilterEvent = {
  action?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export enum ContractSortBy {
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC'
}

export type DataFilter = {
  name: Scalars['String']['input'];
  operator?: InputMaybe<EventDataOperator>;
  value: Scalars['String']['input'];
};

export enum DateGranularity {
  Day = 'DAY',
  FourHours = 'FOUR_HOURS',
  Hour = 'HOUR',
  Month = 'MONTH',
  Quarter = 'QUARTER',
  TwelveHours = 'TWELVE_HOURS',
  Week = 'WEEK',
  Year = 'YEAR'
}

export enum DatePreset {
  AllTime = 'ALL_TIME',
  Last_7Days = 'LAST_7_DAYS',
  Last_24Hours = 'LAST_24_HOURS',
  Last_30Days = 'LAST_30_DAYS',
  Last_90Days = 'LAST_90_DAYS',
  LastYear = 'LAST_YEAR'
}

export type DateRange = {
  endDate?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
};

export type Event = {
  __typename?: 'Event';
  /** Event action. Some event don't have any */
  action?: Maybe<Scalars['String']['output']>;
  /**
   * Bid Price
   * @deprecated Use the metadata denoms field instead
   */
  bidPrice?: Maybe<Price>;
  /** Attribute bidder if any */
  bidder?: Maybe<Address>;
  blockEventIdx: Scalars['Int']['output'];
  blockHeight: Scalars['Int']['output'];
  blockMessageIdx: Scalars['Int']['output'];
  blockTxIdx: Scalars['Int']['output'];
  /** Attribute buyer if any */
  buyer?: Maybe<Address>;
  contract?: Maybe<Contract>;
  /** Contract Address */
  contractAddr?: Maybe<Scalars['String']['output']>;
  /** Contract Code ID */
  contractCodeId?: Maybe<Scalars['String']['output']>;
  /**
   * Contract Attributes
   * @deprecated Field contract_info is deprecated, use contract { contract_info } instead
   */
  contractInfo?: Maybe<Scalars['JSONObject']['output']>;
  /** Contract Type */
  contractType?: Maybe<Scalars['String']['output']>;
  /** Set the the block time, as UTC without timezone */
  createdAt: Scalars['DateTime']['output'];
  data: Scalars['JSON']['output'];
  /** Event name */
  eventName: Scalars['String']['output'];
  /**
   * Is this event expired. An event can be expired but still valid on chain, for example a bid
   * might be expired but still valid on chain and STARS still be locked. User will have to
   * remove that bid to unlock those STARS, this event will then become invalid (is_valid set to
   * false)
   */
  expired: Scalars['Boolean']['output'];
  /** Internal UUID, might change between when the indexer is reran. */
  id: Scalars['ID']['output'];
  /** False if this event has been superseded by another event */
  isValid: Scalars['Boolean']['output'];
  location: Scalars['Int']['output'];
  message?: Maybe<Message>;
  metadata: Scalars['JSON']['output'];
  /** Attribute operator if any */
  operator?: Maybe<Address>;
  /** Attribute owner if any */
  owner?: Maybe<Address>;
  /**
   * Price
   * @deprecated Use the data denoms field instead
   */
  price?: Maybe<Price>;
  /** Attribute recipient if any */
  recipient?: Maybe<Address>;
  /** Attribute seller if any */
  seller?: Maybe<Address>;
  /** Attribute sender if any */
  sender?: Maybe<Address>;
  transaction?: Maybe<Transaction>;
  /** Transaction Hash */
  txHash?: Maybe<Scalars['String']['output']>;
};

/** What operator should be applied */
export enum EventAttributeFilterOperator {
  And = 'AND',
  Or = 'OR'
}

export type EventConnection = {
  __typename?: 'EventConnection';
  edges: Array<EventEdge>;
  pageInfo: PageInfo;
};

/** What operation should be evaluated */
export enum EventDataOperator {
  Equal = 'EQUAL',
  Greater = 'GREATER',
  GreaterOrEqual = 'GREATER_OR_EQUAL',
  Lower = 'LOWER',
  LowerOrEqual = 'LOWER_OR_EQUAL'
}

export type EventEdge = {
  __typename?: 'EventEdge';
  cursor: Scalars['String']['output'];
  node: Event;
};

export enum EventSortBy {
  BlockHeightAsc = 'BLOCK_HEIGHT_ASC',
  BlockHeightDesc = 'BLOCK_HEIGHT_DESC'
}

export type EventsFilter = {
  events: Array<ContractFilterEvent>;
  operator?: InputMaybe<EventAttributeFilterOperator>;
};

/** Ready to use filters to get specific kind of events */
export enum Filter {
  /** Any event related to airdrops */
  Airdrops = 'AIRDROPS',
  /** Any event related to asks */
  Asks = 'ASKS',
  /** Any event related to bids */
  Bids = 'BIDS',
  /** Any event related to collection bids */
  CollectionBids = 'COLLECTION_BIDS',
  /** Any filtered event related to a given name, use with `attribute_filters` */
  FilteredNameEvents = 'FILTERED_NAME_EVENTS',
  /** Any event related to mints */
  Mints = 'MINTS',
  /** Any event related to name asks */
  NameAsks = 'NAME_ASKS',
  /** Any event related to name bids */
  NameBids = 'NAME_BIDS',
  /** Any event related to a given name, use with `attribute_filters` */
  NameEvents = 'NAME_EVENTS',
  /** Any event related to name sales */
  NameSales = 'NAME_SALES',
  /** Any event related to received offer on owned names, use with `for_addresses` */
  ReceivedOffersOnOwnedNames = 'RECEIVED_OFFERS_ON_OWNED_NAMES',
  /** Any event related to received offer on owned NFT, use with `for_addresses` */
  ReceivedOffersOnOwnedNft = 'RECEIVED_OFFERS_ON_OWNED_NFT',
  /** Any event related to sales */
  Sales = 'SALES',
  /** Any event related to sent name offers, use with `for_addresses` */
  SentNameOffers = 'SENT_NAME_OFFERS',
  /** Any event related to a given NFT, use with `for_token` */
  TokenMetadatas = 'TOKEN_METADATAS'
}

export type Message = {
  __typename?: 'Message';
  blockHeight: Scalars['Int']['output'];
  /**
   * Transaction Idx
   * Message Idx within the transaction
   */
  blockTxIdx: Scalars['Int']['output'];
  contract?: Maybe<Contract>;
  /** Cosmwasm Method */
  cosmwasmMethod?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  /** Message Attributes */
  data: Scalars['JSON']['output'];
  /** Careful: this is only returning the last 100 events */
  events?: Maybe<Array<Event>>;
  /** Internal UUID, might change between when the indexer is reran. */
  id: Scalars['ID']['output'];
  idx: Scalars['Int']['output'];
  transaction?: Maybe<Transaction>;
  /** Type URL */
  typeUrl: Scalars['String']['output'];
};

export type MessageConnection = {
  __typename?: 'MessageConnection';
  edges: Array<MessageEdge>;
  pageInfo: PageInfo;
};

export type MessageDataFilter = {
  operator?: InputMaybe<EventDataOperator>;
  path: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type MessageEdge = {
  __typename?: 'MessageEdge';
  cursor: Scalars['String']['output'];
  node: Message;
};

export enum MessageSortBy {
  BlockHeightAsc = 'BLOCK_HEIGHT_ASC',
  BlockHeightDesc = 'BLOCK_HEIGHT_DESC'
}

export enum NameSortBy {
  MintedAtAsc = 'MINTED_AT_ASC',
  MintedAtDesc = 'MINTED_AT_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  OffersAsc = 'OFFERS_ASC',
  OffersDesc = 'OFFERS_DESC'
}

export type OfferNode = {
  __typename?: 'OfferNode';
  limit: Scalars['Int']['output'];
  offers: Array<Event>;
  offset: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export enum OfferType {
  All = 'ALL',
  Collection = 'COLLECTION',
  Token = 'TOKEN'
}

export enum OffersSortBy {
  BlockHeightAsc = 'BLOCK_HEIGHT_ASC',
  BlockHeightDesc = 'BLOCK_HEIGHT_DESC',
  PriceAsc = 'PRICE_ASC',
  PriceDesc = 'PRICE_DESC',
  PriceUsdAsc = 'PRICE_USD_ASC',
  PriceUsdDesc = 'PRICE_USD_DESC'
}

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type Price = {
  __typename?: 'Price';
  amount: Scalars['String']['output'];
  /** Detected base denom, defaults to chain denom, null if equal to `denom` */
  baseDenom?: Maybe<Scalars['String']['output']>;
  currentUsd?: Maybe<PriceWithRate>;
  /** On chain denom specified by the chain, null if none specified */
  denom?: Maybe<Scalars['String']['output']>;
  /** Prefixed denom. For IBC denoms includes channels. */
  prefixedDenom?: Maybe<Scalars['String']['output']>;
  /** USD value at block time, if any, taken from coingecko */
  usd?: Maybe<PriceWithRate>;
};

export type PriceFilter = {
  max?: InputMaybe<Scalars['Decimal']['input']>;
  min?: InputMaybe<Scalars['Decimal']['input']>;
  useUsd?: Scalars['Boolean']['input'];
};

export type PriceWithRate = {
  __typename?: 'PriceWithRate';
  amount: Scalars['Decimal']['output'];
  coingeckoId?: Maybe<Scalars['String']['output']>;
  denom: Scalars['String']['output'];
  fromDenom: Scalars['String']['output'];
  rate: Scalars['Decimal']['output'];
  tracing?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  blocks: BlockConnection;
  /** Fetch a collection by its address */
  collection?: Maybe<Collection>;
  /** Fetch traits for a collection */
  collectionTraits: Array<Collection_Trait>;
  /** Fetch collections */
  collections: Collection_Node;
  /** Contract */
  contract?: Maybe<Contract>;
  /** Contracts */
  contracts: Contract_Node;
  events: EventConnection;
  /** IBC Client */
  ibcClient?: Maybe<Ibc_Client>;
  latestPrices: Latest_Prices_Node;
  messages: MessageConnection;
  /** Name by name */
  name?: Maybe<Name>;
  /** Names */
  names: Name_Node;
  offers: OfferNode;
  /** Fetch collection addresses and count of tokens owned for an address */
  ownedCollections: Owned_Collections_Node;
  /** Fetch NFT sales */
  sales: Sales_Node;
  /** Fetch historical sales stats for Stargaze or for a specific collection */
  salesStats: Sales_Stats_Node;
  token?: Maybe<Token>;
  tokens: Token_Node;
  transaction?: Maybe<Transaction>;
  transactions: TransactionConnection;
};


export type QueryBlocksArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  blockHeights?: InputMaybe<Array<Scalars['Int']['input']>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<BlockSortBy>;
};


export type QueryCollectionArgs = {
  collectionAddr: Scalars['String']['input'];
};


export type QueryCollectionTraitsArgs = {
  collectionAddr: Scalars['String']['input'];
  filterByOwnerAddr?: InputMaybe<Scalars['String']['input']>;
  filterForSale?: InputMaybe<SaleType>;
  priceInUsd?: Scalars['Boolean']['input'];
};


export type QueryCollectionsArgs = {
  creatorAddr?: InputMaybe<Scalars['String']['input']>;
  isBlocked?: Scalars['Boolean']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<CollectionSortBy>;
  tokenOwnerAddr?: InputMaybe<Scalars['String']['input']>;
};


export type QueryContractArgs = {
  address: Scalars['String']['input'];
};


export type QueryContractsArgs = {
  contractTypes?: InputMaybe<Array<Scalars['String']['input']>>;
  dataFilters?: InputMaybe<Array<ContractDataFilter>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<ContractSortBy>;
};


export type QueryEventsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  attributeFilters?: InputMaybe<AttributeFilter>;
  before?: InputMaybe<Scalars['String']['input']>;
  contractFilters?: InputMaybe<Array<ContractFilter>>;
  dataFilters?: InputMaybe<Array<DataFilter>>;
  eventsFilters?: InputMaybe<EventsFilter>;
  filter?: InputMaybe<Filter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  forAddresses?: InputMaybe<Array<Scalars['String']['input']>>;
  forContractAddrs?: InputMaybe<Array<Scalars['String']['input']>>;
  forToken?: InputMaybe<TokenInput>;
  isValid?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<EventSortBy>;
};


export type QueryIbcClientArgs = {
  ibcClientId: Scalars['String']['input'];
};


export type QueryLatestPricesArgs = {
  coingeckoId?: InputMaybe<Scalars['String']['input']>;
  coinmarketcapId?: InputMaybe<Scalars['String']['input']>;
  denom?: InputMaybe<Scalars['String']['input']>;
  symbol?: InputMaybe<Scalars['String']['input']>;
};


export type QueryMessagesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  attributeFilters?: InputMaybe<AttributeMessageFilter>;
  before?: InputMaybe<Scalars['String']['input']>;
  blockHeights?: InputMaybe<Array<Scalars['Int']['input']>>;
  cosmwasmMethods?: InputMaybe<Array<Scalars['String']['input']>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<MessageSortBy>;
  typeUrls?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryNameArgs = {
  name: Scalars['String']['input'];
};


export type QueryNamesArgs = {
  associatedAddr?: InputMaybe<Scalars['String']['input']>;
  filterByRecords?: InputMaybe<Array<RecordFilter>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ownerAddr?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<NameSortBy>;
};


export type QueryOffersArgs = {
  filterByBidderAddr?: InputMaybe<Scalars['String']['input']>;
  filterByCollectionAddr?: InputMaybe<Scalars['String']['input']>;
  filterByOfferType?: OfferType;
  filterByTokenId?: InputMaybe<Scalars['String']['input']>;
  includeExpired?: Scalars['Boolean']['input'];
  isValid?: Scalars['Boolean']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<OffersSortBy>;
};


export type QueryOwnedCollectionsArgs = {
  filterForSale?: InputMaybe<SaleType>;
  includeBlocked?: Scalars['Boolean']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ownerAddr?: InputMaybe<Scalars['String']['input']>;
  sellerAddr?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySalesArgs = {
  datePresetFilter?: InputMaybe<DatePreset>;
  dateRangeFilter?: InputMaybe<DateRange>;
  filterByCollectionAddrs?: InputMaybe<Array<Scalars['String']['input']>>;
  filterBySaleType?: InputMaybe<Array<SalesSaleType>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<SalesSortBy>;
};


export type QuerySalesStatsArgs = {
  collectionAddr?: InputMaybe<Scalars['String']['input']>;
  datePresetFilter?: InputMaybe<DatePreset>;
  dateRangeFilter?: InputMaybe<DateRange>;
  granularity?: DateGranularity;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryTokenArgs = {
  collectionAddr: Scalars['String']['input'];
  tokenId: Scalars['String']['input'];
};


export type QueryTokensArgs = {
  collectionAddr?: InputMaybe<Scalars['String']['input']>;
  filterAuctionEndByDate?: InputMaybe<DateRange>;
  filterAuctionEndByPreset?: InputMaybe<AuctionEndPreset>;
  filterByAskPriceDenom?: InputMaybe<Scalars['String']['input']>;
  filterByCollectionAddrs?: InputMaybe<Array<Scalars['String']['input']>>;
  filterByPrices?: InputMaybe<PriceFilter>;
  filterByRarity?: InputMaybe<RarityFilter>;
  filterByTraits?: InputMaybe<Array<TraitFilter>>;
  filterForSale?: InputMaybe<SaleType>;
  includeBlocked?: Scalars['Boolean']['input'];
  includeBurned?: Scalars['Boolean']['input'];
  includeUnminted?: Scalars['Boolean']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  ownerAddr?: InputMaybe<Scalars['String']['input']>;
  sellerAddr?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<TokenSortBy>;
};


export type QueryTransactionArgs = {
  blockHeight: Scalars['Int']['input'];
  hash: Scalars['String']['input'];
};


export type QueryTransactionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  blockHeights?: InputMaybe<Array<Scalars['Int']['input']>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<TransactionSortBy>;
  transactionHashes?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type RarityFilter = {
  max?: InputMaybe<Scalars['Int']['input']>;
  min?: InputMaybe<Scalars['Int']['input']>;
};

/** Filter on records, example: `name: twitter, value: fabienpenso` */
export type RecordFilter = {
  name: Scalars['String']['input'];
  value: Scalars['String']['input'];
  verified?: InputMaybe<Scalars['Boolean']['input']>;
};

export enum SaleType {
  Any = 'ANY',
  Auction = 'AUCTION',
  Expired = 'EXPIRED',
  FixedPrice = 'FIXED_PRICE',
  Listed = 'LISTED',
  LiveAuction = 'LIVE_AUCTION',
  Unlisted = 'UNLISTED'
}

export enum SalesSaleType {
  Auction = 'AUCTION',
  CollectionOffer = 'COLLECTION_OFFER',
  FixedPrice = 'FIXED_PRICE',
  Offer = 'OFFER'
}

export enum SalesSortBy {
  PriceAsc = 'PRICE_ASC',
  PriceDesc = 'PRICE_DESC',
  RarityAsc = 'RARITY_ASC',
  RarityDesc = 'RARITY_DESC',
  SaleTimeAsc = 'SALE_TIME_ASC',
  SaleTimeDesc = 'SALE_TIME_DESC',
  StarsPriceAsc = 'STARS_PRICE_ASC',
  StarsPriceDesc = 'STARS_PRICE_DESC',
  TokenIdAsc = 'TOKEN_ID_ASC',
  TokenIdDesc = 'TOKEN_ID_DESC',
  UsdPriceAsc = 'USD_PRICE_ASC',
  UsdPriceDesc = 'USD_PRICE_DESC'
}

export type TokenInput = {
  collectionAddr: Scalars['String']['input'];
  tokenId: Scalars['String']['input'];
};

export enum TokenSortBy {
  AcquiredAsc = 'ACQUIRED_ASC',
  AcquiredDesc = 'ACQUIRED_DESC',
  CollectionAddrTokenIdAsc = 'COLLECTION_ADDR_TOKEN_ID_ASC',
  FloorPriceAsc = 'FLOOR_PRICE_ASC',
  FloorPriceDesc = 'FLOOR_PRICE_DESC',
  ListedAsc = 'LISTED_ASC',
  ListedDesc = 'LISTED_DESC',
  ListingType = 'LISTING_TYPE',
  LiveAuctionEndTimeAsc = 'LIVE_AUCTION_END_TIME_ASC',
  LiveAuctionEndTimeDesc = 'LIVE_AUCTION_END_TIME_DESC',
  LiveAuctionHighestBidAsc = 'LIVE_AUCTION_HIGHEST_BID_ASC',
  LiveAuctionHighestBidDesc = 'LIVE_AUCTION_HIGHEST_BID_DESC',
  LiveAuctionStartTimeAsc = 'LIVE_AUCTION_START_TIME_ASC',
  LiveAuctionStartTimeDesc = 'LIVE_AUCTION_START_TIME_DESC',
  MintedAsc = 'MINTED_ASC',
  MintedDesc = 'MINTED_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  PriceAsc = 'PRICE_ASC',
  PriceDesc = 'PRICE_DESC',
  PriceUsdAsc = 'PRICE_USD_ASC',
  PriceUsdDesc = 'PRICE_USD_DESC',
  RarityAsc = 'RARITY_ASC',
  RarityDesc = 'RARITY_DESC',
  TokenIdAsc = 'TOKEN_ID_ASC',
  TokenIdDesc = 'TOKEN_ID_DESC'
}

export type TraitFilter = {
  name: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type Transaction = {
  __typename?: 'Transaction';
  blockHeight: Scalars['Int']['output'];
  code: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  errorMessage?: Maybe<Scalars['String']['output']>;
  /** Careful: this is only returning the last 100 events */
  events?: Maybe<Array<Event>>;
  gasUsed: Scalars['Int']['output'];
  gasWanted: Scalars['Int']['output'];
  /** Transaction Hash */
  hash: Scalars['String']['output'];
  /** Internal UUID, might change between when the indexer is reran. */
  id: Scalars['ID']['output'];
  idx: Scalars['Int']['output'];
  memo?: Maybe<Scalars['String']['output']>;
  /** Careful: this is only returning the last 100 messages */
  messages?: Maybe<Array<Message>>;
};

export type TransactionConnection = {
  __typename?: 'TransactionConnection';
  edges: Array<TransactionEdge>;
  pageInfo: PageInfo;
};

export type TransactionEdge = {
  __typename?: 'TransactionEdge';
  cursor: Scalars['String']['output'];
  node: Transaction;
};

export enum TransactionSortBy {
  BlockHeightAsc = 'BLOCK_HEIGHT_ASC',
  BlockHeightDesc = 'BLOCK_HEIGHT_DESC'
}

export type Address = {
  __typename?: 'address';
  addr: Scalars['String']['output'];
  /** the associated name, if any */
  name?: Maybe<Name>;
};

export type Collection = {
  __typename?: 'collection';
  /** Is this collection manually blocked */
  blocked: Scalars['Boolean']['output'];
  /** Collection address */
  collectionAddr: Scalars['String']['output'];
  /**
   * When was this collection created at.
   * @deprecated Field created_at is deprecated, use minted_at instead
   */
  createdAt: Scalars['DateTime']['output'];
  /** The address that created this collection */
  createdBy: Address;
  /** Creator address */
  createdByAddr: Scalars['String']['output'];
  /** Description */
  description: Scalars['String']['output'];
  /**
   * The floor price is the lowest price for any currently for sale item in the collection.
   * Returned in the native denom of the lowest priced item.
   */
  floorPrice?: Maybe<Scalars['Int']['output']>;
  /**
   * The floor price is the lowest price for any currently for sale item in the collection.
   * Returned as the STARS value, calculated from the item's listed denom.
   */
  floorPriceStars?: Maybe<Scalars['Decimal']['output']>;
  /**
   * The floor price is the lowest price for any currently for sale item in the collection.
   * Returned as USD.
   */
  floorPriceUsd?: Maybe<Scalars['Decimal']['output']>;
  /** Internal UUID, might change between when the indexer is reran. */
  id: Scalars['ID']['output'];
  /** Main image */
  image: Scalars['String']['output'];
  imageObject?: Maybe<Image>;
  /** When was this collection minted on chain. UTC without timezone */
  mintedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Collection minter address */
  minterAddr?: Maybe<Scalars['String']['output']>;
  /** Name */
  name: Scalars['String']['output'];
  /**
   * How many tokens this collection has for the given owner when called through
   * OwnedCollections
   */
  ownerTokensCount?: Maybe<Scalars['Int']['output']>;
  /** Owners for this collection */
  owners: Collection_Owners;
  ownersCount?: Maybe<Scalars['Int']['output']>;
  /** How many tokens this collection has */
  tokensCount?: Maybe<Scalars['Int']['output']>;
  /** Website */
  website?: Maybe<Scalars['String']['output']>;
  /** Whitelist address */
  whitelistAddr?: Maybe<Scalars['String']['output']>;
};


export type CollectionOwnersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type Collection_Node = {
  __typename?: 'collection_node';
  collections: Array<Collection>;
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type Collection_Owner = {
  __typename?: 'collection_owner';
  count: Scalars['Int']['output'];
  owner: Address;
};

export type Collection_Owners = {
  __typename?: 'collection_owners';
  owners: Array<Collection_Owner>;
  totalCount: Scalars['Int']['output'];
};

export type Collection_Token_Count = {
  __typename?: 'collection_token_count';
  collectionAddr: Scalars['String']['output'];
  tokenCount: Scalars['Int']['output'];
};

export type Collection_Trait = {
  __typename?: 'collection_trait';
  name: Scalars['String']['output'];
  values: Array<Collection_Trait_Value>;
};

export type Collection_Trait_Value = {
  __typename?: 'collection_trait_value';
  numTokens: Scalars['Int']['output'];
  numTokensForSale: Scalars['Int']['output'];
  rarityPercent?: Maybe<Scalars['Float']['output']>;
  traitFloorPrice?: Maybe<Scalars['Float']['output']>;
  value: Scalars['String']['output'];
};

export type Contract = {
  __typename?: 'contract';
  blockHeight: Scalars['Int']['output'];
  blocked: Scalars['Boolean']['output'];
  contractAddr: Scalars['String']['output'];
  contractCodeId?: Maybe<Scalars['String']['output']>;
  contractInfo: Scalars['JSONObject']['output'];
  contractLabel?: Maybe<Scalars['String']['output']>;
  contractType: Scalars['String']['output'];
  contractVersion?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['NaiveDateTime']['output'];
  createdMessageId?: Maybe<Scalars['UUID']['output']>;
  lastErrorAt?: Maybe<Scalars['NaiveDateTime']['output']>;
  updatedAt: Scalars['NaiveDateTime']['output'];
};

export type Contract_Node = {
  __typename?: 'contract_node';
  contracts: Array<Contract>;
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type Ibc_Client = {
  __typename?: 'ibc_client';
  blockHeight: Scalars['Int']['output'];
  clientId: Scalars['String']['output'];
  clientType: Scalars['String']['output'];
  counterpartyChainId: Scalars['String']['output'];
  createdAt: Scalars['NaiveDateTime']['output'];
  signer: Scalars['String']['output'];
  updatedAt: Scalars['NaiveDateTime']['output'];
};

export type Image = {
  __typename?: 'image';
  contentLength?: Maybe<Scalars['Int']['output']>;
  contentType?: Maybe<Scalars['String']['output']>;
  height?: Maybe<Scalars['Int']['output']>;
  url: Scalars['String']['output'];
  width?: Maybe<Scalars['Int']['output']>;
};

export type Latest_Price = {
  __typename?: 'latest_price';
  coingeckoId: Scalars['String']['output'];
  coinmarketcapId: Scalars['String']['output'];
  denom: Scalars['String']['output'];
  exponent: Scalars['Int']['output'];
  price: Scalars['Decimal']['output'];
  symbol: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type Latest_Prices_Node = {
  __typename?: 'latest_prices_node';
  prices: Array<Latest_Price>;
  total: Scalars['Int']['output'];
};

export type Name = {
  __typename?: 'name';
  askPrice?: Maybe<Price>;
  associatedAddr?: Maybe<Scalars['String']['output']>;
  contractAddr: Scalars['String']['output'];
  forSale: Scalars['Boolean']['output'];
  highestOffer?: Maybe<Scalars['Decimal']['output']>;
  highestOfferEvent?: Maybe<Event>;
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  mintedAt?: Maybe<Scalars['DateTime']['output']>;
  name: Scalars['String']['output'];
  ownerAddr: Scalars['String']['output'];
  records?: Maybe<Array<Name_Record>>;
};

export type Name_Node = {
  __typename?: 'name_node';
  limit: Scalars['Int']['output'];
  names: Array<Name>;
  offset: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type Name_Record = {
  __typename?: 'name_record';
  contractAddr: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  recordName: Scalars['String']['output'];
  recordValue: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  verified: Scalars['Boolean']['output'];
};

export type Owned_Collections_Node = {
  __typename?: 'owned_collections_node';
  collections: Array<Collection>;
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  /** @deprecated Field owned_collections_token_count is deprecated, use collections instead */
  ownedCollectionsTokenCount: Array<Collection_Token_Count>;
  total: Scalars['Int']['output'];
};

export type Sale = {
  __typename?: 'sale';
  /** Block Height */
  blockHeight: Scalars['Int']['output'];
  /** Buyer Address */
  buyer?: Maybe<Scalars['String']['output']>;
  /** Collection Address */
  collectionAddr: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  /** Rarity Order */
  rarityOrder?: Maybe<Scalars['Int']['output']>;
  /** Sale Denom */
  saleDenom: Scalars['String']['output'];
  /** Sale Denom Symbol */
  saleDenomSymbol: Scalars['String']['output'];
  /** Sale Price in Denom */
  salePrice: Scalars['Int']['output'];
  /**
   * Sale Price in STARS
   * @deprecated Field sale_price_stars is deprecated, use sale_price and sale_denom instead
   */
  salePriceStars: Scalars['Int']['output'];
  /** Sale Price in USD */
  salePriceUsd: Scalars['Decimal']['output'];
  /** Event Name */
  saleType: Scalars['String']['output'];
  /** Seller Address */
  seller?: Maybe<Scalars['String']['output']>;
  /** Token ID */
  tokenId: Scalars['String']['output'];
  /** Transaction Hash */
  txHash?: Maybe<Scalars['String']['output']>;
};

export type Sales_Node = {
  __typename?: 'sales_node';
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  sales: Array<Sale>;
  total: Scalars['Int']['output'];
};

export type Sales_Stats = {
  __typename?: 'sales_stats';
  /** Average sale price in STARS */
  avgPriceStars: Scalars['Decimal']['output'];
  /** Average sale price in USD */
  avgPriceUsd: Scalars['Decimal']['output'];
  /** Sales count */
  salesCount: Scalars['Int']['output'];
  timePeriod?: Maybe<Scalars['NaiveDateTime']['output']>;
  /** Volume in STARS */
  volumeStars: Scalars['Decimal']['output'];
  /** Volume in USD */
  volumeUsd: Scalars['Decimal']['output'];
};

export type Sales_Stats_Node = {
  __typename?: 'sales_stats_node';
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  salesStats: Array<Sales_Stats>;
  /** Total values for the selected time period */
  statsTotals: Sales_Stats_Totals;
  total: Scalars['Int']['output'];
};

export type Sales_Stats_Totals = {
  __typename?: 'sales_stats_totals';
  avgPriceStars: Scalars['Decimal']['output'];
  avgPriceUsd: Scalars['Decimal']['output'];
  salesCount: Scalars['Int']['output'];
  volumeStars: Scalars['Decimal']['output'];
  volumeUsd: Scalars['Decimal']['output'];
};

export type Token = {
  __typename?: 'token';
  animation?: Maybe<Image>;
  animationUrl?: Maybe<Scalars['String']['output']>;
  askId?: Maybe<Scalars['String']['output']>;
  collectionAddr: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  escrowContractAddr?: Maybe<Scalars['String']['output']>;
  escrowContractType?: Maybe<Scalars['String']['output']>;
  forSale: Scalars['Boolean']['output'];
  /** The highest non-expired valid bid for this token */
  highestBid?: Maybe<Scalars['Decimal']['output']>;
  /** The highest non-expired valid bid for this token */
  highestBidEvent?: Maybe<Event>;
  /** The highest non-expired valid collection bid for the collection attached to this token */
  highestCollectionBid?: Maybe<Scalars['Decimal']['output']>;
  /** The highest non-expired valid collection bid for the collection attached to this token */
  highestCollectionBidEvent?: Maybe<Event>;
  highestLiveAuctionBidEvent?: Maybe<Event>;
  id: Scalars['ID']['output'];
  image?: Maybe<Image>;
  imageUrl?: Maybe<Scalars['String']['output']>;
  isEscrowed: Scalars['Boolean']['output'];
  /** The latest sale */
  lastSale?: Maybe<Event>;
  listedAt?: Maybe<Scalars['DateTime']['output']>;
  liveAuctionEndTime?: Maybe<Scalars['DateTime']['output']>;
  liveAuctionEvent?: Maybe<Event>;
  liveAuctionHighestBid?: Maybe<Price>;
  liveAuctionStartTime?: Maybe<Scalars['DateTime']['output']>;
  mintedAt?: Maybe<Scalars['DateTime']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  /** The address that owns this token */
  owner?: Maybe<Address>;
  ownerAddr?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Price>;
  priceExpiresAt?: Maybe<Scalars['DateTime']['output']>;
  rarityOrder?: Maybe<Scalars['Int']['output']>;
  rarityScore?: Maybe<Scalars['Decimal']['output']>;
  saleType?: Maybe<Scalars['String']['output']>;
  sellerAddr?: Maybe<Scalars['String']['output']>;
  tokenId: Scalars['String']['output'];
  traits?: Maybe<Array<Token_Trait>>;
};

export type Token_Node = {
  __typename?: 'token_node';
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  tokens: Array<Token>;
  total: Scalars['Int']['output'];
};

export type Token_Trait = {
  __typename?: 'token_trait';
  name: Scalars['String']['output'];
  rarity?: Maybe<Scalars['Float']['output']>;
  rarityPercent?: Maybe<Scalars['Float']['output']>;
  rarityScore?: Maybe<Scalars['Float']['output']>;
  value: Scalars['String']['output'];
};
