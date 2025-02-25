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
  JSONString: { input: any; output: any; }
  UUID: { input: any; output: any; }
};

export type ApiMetricesType = {
  __typename?: 'ApiMetricesType';
  apiName?: Maybe<Scalars['String']['output']>;
  apiUrl: Scalars['String']['output'];
  assertionAndLimit: Array<AssertionAndLimitQueryType>;
  availability_uptime?: Maybe<Scalars['Float']['output']>;
  avg_first_byte_time?: Maybe<Scalars['Float']['output']>;
  avg_latency?: Maybe<Scalars['Float']['output']>;
  avg_response_size?: Maybe<Scalars['Float']['output']>;
  downtime?: Maybe<Scalars['Float']['output']>;
  error_count?: Maybe<Scalars['Int']['output']>;
  error_rates?: Maybe<Scalars['Float']['output']>;
  id: Scalars['UUID']['output'];
  isApiActive: Scalars['Boolean']['output'];
  last_Error_Occurred?: Maybe<Scalars['DateTime']['output']>;
  methodType: ApimonitoringMonitoredApiMethodtypeChoices;
  percentile_50?: Maybe<PercentileResponseType>;
  percentile_90?: Maybe<PercentileResponseType>;
  percentile_99?: Maybe<PercentileResponseType>;
  response_time?: Maybe<Array<Maybe<ResponseTimeType>>>;
  schedulingAndAlerting: Array<SchedulingAndAlertingQueryType>;
  success_count?: Maybe<Scalars['Int']['output']>;
  success_rates?: Maybe<Scalars['Float']['output']>;
  throughput?: Maybe<Scalars['Float']['output']>;
};

export type ApiMonitorCreateMutation = {
  __typename?: 'ApiMonitorCreateMutation';
  message?: Maybe<Scalars['String']['output']>;
  monitoredApi?: Maybe<MoniterApiType>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type ApiMonitorUpdateMutation = {
  __typename?: 'ApiMonitorUpdateMutation';
  message?: Maybe<Scalars['String']['output']>;
  monitoredApi?: Maybe<MoniterApiType>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

/** An enumeration. */
export enum ApimonitoringMonitoredApiMethodtypeChoices {
  /** GET */
  Get = 'GET',
  /** POST */
  Post = 'POST'
}

export type AssertionAndLimitQueryType = {
  __typename?: 'AssertionAndLimitQueryType';
  api: ApiMetricesType;
  degradedResponseTime?: Maybe<Scalars['Int']['output']>;
  failedResponseTime?: Maybe<Scalars['Int']['output']>;
  id: Scalars['UUID']['output'];
};

export type AssertionAndLimitType = {
  degradedResponseTime?: InputMaybe<Scalars['Int']['input']>;
  failedResponseTime?: InputMaybe<Scalars['Int']['input']>;
};

export type AuthTypeChoice = {
  __typename?: 'AuthTypeChoice';
  key?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

export type BusinessUnitCreateMutation = {
  __typename?: 'BusinessUnitCreateMutation';
  businessUnit?: Maybe<BusinessUnitType>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type BusinessUnitType = {
  __typename?: 'BusinessUnitType';
  businessUnitDescription: Scalars['String']['output'];
  businessUnitName: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
};

export type BusinessUnitUpdateMutation = {
  __typename?: 'BusinessUnitUpdateMutation';
  businessUnit?: Maybe<BusinessUnitType>;
  businessUnitDescription?: Maybe<Scalars['String']['output']>;
  businessUnitDl?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type MoniterApiType = {
  __typename?: 'MoniterApiType';
  apiName?: Maybe<Scalars['String']['output']>;
  apiUrl: Scalars['String']['output'];
  assertionAndLimit: Array<AssertionAndLimitQueryType>;
  businessUnit: BusinessUnitType;
  createdAt: Scalars['DateTime']['output'];
  headers?: Maybe<Scalars['JSONString']['output']>;
  id: Scalars['UUID']['output'];
  isApiActive: Scalars['Boolean']['output'];
  methodType: ApimonitoringMonitoredApiMethodtypeChoices;
  requestBody?: Maybe<Scalars['String']['output']>;
  schedulingAndAlerting: Array<SchedulingAndAlertingQueryType>;
  subBusinessUnit: SubBusinessUnitType;
};

export type MonitoredApiInput = {
  apiName: Scalars['String']['input'];
  apiUrl: Scalars['String']['input'];
  assertionAndLimit: AssertionAndLimitType;
  businessUnit: Scalars['UUID']['input'];
  headers: Scalars['String']['input'];
  methodType: Scalars['String']['input'];
  requestBody: Scalars['String']['input'];
  schedulingAndAlerting: SchedulingAndAlertingType;
  subBusinessUnit: Scalars['UUID']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createApiMonitor?: Maybe<ApiMonitorCreateMutation>;
  createBusinessUnit?: Maybe<BusinessUnitCreateMutation>;
  createSubbusinessUnit?: Maybe<SubBusinessUnitCreateMutation>;
  updateApiMonitor?: Maybe<ApiMonitorUpdateMutation>;
  updateBusinessUnit?: Maybe<BusinessUnitUpdateMutation>;
  updateSubbusinessUnit?: Maybe<SubBusinessUnitUpdateMutation>;
};


export type MutationCreateApiMonitorArgs = {
  input: MonitoredApiInput;
};


export type MutationCreateBusinessUnitArgs = {
  businessUnitDescription: Scalars['String']['input'];
  businessUnitDl: Scalars['String']['input'];
  businessUnitName: Scalars['String']['input'];
};


export type MutationCreateSubbusinessUnitArgs = {
  businessUnit: Scalars['UUID']['input'];
  subBusinessUnitDescription: Scalars['String']['input'];
  subBusinessUnitDl: Scalars['String']['input'];
  subBusinessUnitName: Scalars['String']['input'];
};


export type MutationUpdateApiMonitorArgs = {
  id: Scalars['UUID']['input'];
  input?: InputMaybe<MonitoredApiInput>;
  isApiActive?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Query = {
  __typename?: 'Query';
  authTypeChoices?: Maybe<Array<Maybe<AuthTypeChoice>>>;
  businessUnit?: Maybe<Array<Maybe<BusinessUnitType>>>;
  getAllMetrices?: Maybe<Array<Maybe<ApiMetricesType>>>;
  getServiceById?: Maybe<MoniterApiType>;
  methodTypeChoices?: Maybe<Array<Maybe<MethodTypeChoice>>>;
  subBusinessUnit?: Maybe<SubBusinessUnitType>;
  subBusinessUnitPerBusinessUnit?: Maybe<Array<Maybe<SubBusinessUnitType>>>;
  validateApi?: Maybe<ValidateApiResponse>;
  validateTeamsChannel?: Maybe<ValidateApiResponse>;
};


export type QueryBusinessUnitArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


export type QueryGetAllMetricesArgs = {
  apiMonitoringId?: InputMaybe<Scalars['UUID']['input']>;
  businessUnit?: InputMaybe<Scalars['UUID']['input']>;
  fromDate?: InputMaybe<Scalars['DateTime']['input']>;
  searchParam?: InputMaybe<Scalars['String']['input']>;
  subBusinessUnit?: InputMaybe<Scalars['UUID']['input']>;
  timeRange?: InputMaybe<Scalars['Int']['input']>;
  timeUnit?: InputMaybe<Scalars['String']['input']>;
  toDate?: InputMaybe<Scalars['DateTime']['input']>;
};


export type QueryGetServiceByIdArgs = {
  serviceId: Scalars['UUID']['input'];
};


export type QuerySubBusinessUnitArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


export type QuerySubBusinessUnitPerBusinessUnitArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryValidateApiArgs = {
  apiUrl: Scalars['String']['input'];
  headers?: InputMaybe<Scalars['String']['input']>;
  methodType: Scalars['String']['input'];
  requestBody?: InputMaybe<Scalars['String']['input']>;
};


export type QueryValidateTeamsChannelArgs = {
  channelUrl: Scalars['String']['input'];
};

export type SchedulingAndAlertingQueryType = {
  __typename?: 'SchedulingAndAlertingQueryType';
  api: ApiMetricesType;
  apiCallInterval?: Maybe<Scalars['Int']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  maxRetries?: Maybe<Scalars['Int']['output']>;
  recipientDl: Scalars['JSONString']['output'];
  retryAfter?: Maybe<Scalars['Int']['output']>;
  teamsChannelWebhookURL?: Maybe<Scalars['String']['output']>;
};

export type SchedulingAndAlertingType = {
  apiCallInterval?: InputMaybe<Scalars['Int']['input']>;
  createdBy?: InputMaybe<Scalars['String']['input']>;
  maxRetries?: InputMaybe<Scalars['Int']['input']>;
  recipientDl: Scalars['String']['input'];
  retryAfter?: InputMaybe<Scalars['Int']['input']>;
  teamsChannelWebhookURL?: InputMaybe<Scalars['String']['input']>;
};

export type SubBusinessUnitCreateMutation = {
  __typename?: 'SubBusinessUnitCreateMutation';
  message?: Maybe<Scalars['String']['output']>;
  subBusinessUnit?: Maybe<SubBusinessUnitType>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type SubBusinessUnitType = {
  __typename?: 'SubBusinessUnitType';
  businessUnit: BusinessUnitType;
  id: Scalars['UUID']['output'];
  subBusinessUnitDescription: Scalars['String']['output'];
  subBusinessUnitName: Scalars['String']['output'];
};

export type SubBusinessUnitUpdateMutation = {
  __typename?: 'SubBusinessUnitUpdateMutation';
  id: Scalars['UUID']['output'];
  message?: Maybe<Scalars['String']['output']>;
  subBusinessUnit?: Maybe<SubBusinessUnitType>;
  subBusinessUnitDescription?: Maybe<Scalars['String']['output']>;
  subBusinessUnitDl?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type MethodTypeChoice = {
  __typename?: 'methodTypeChoice';
  key?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

export type PercentileResponseType = {
  __typename?: 'percentileResponseType';
  currPercentileResTime?: Maybe<Scalars['Float']['output']>;
  percentageDiff?: Maybe<Scalars['Float']['output']>;
};

export type ResponseTimeType = {
  __typename?: 'responseTimeType';
  responsetime?: Maybe<Scalars['Float']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  timestamp?: Maybe<Scalars['DateTime']['output']>;
};

export type ValidateApiResponse = {
  __typename?: 'validateApiResponse';
  message?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['Int']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type CreateBusinessUnitMutationVariables = Exact<{
  businessUnitName: Scalars['String']['input'];
  businessUnitDescription: Scalars['String']['input'];
  businessUnitDl: Scalars['String']['input'];
}>;


export type CreateBusinessUnitMutation = { __typename?: 'Mutation', createBusinessUnit?: { __typename?: 'BusinessUnitCreateMutation', success?: boolean | null, message?: string | null, businessUnit?: { __typename?: 'BusinessUnitType', id: any, businessUnitName: string, businessUnitDescription: string } | null } | null };

export type CreateSubbusinessUnitMutationVariables = Exact<{
  businessUnit: Scalars['UUID']['input'];
  subBusinessUnitName: Scalars['String']['input'];
  subBusinessUnitDescription: Scalars['String']['input'];
  subBusinessUnitDl: Scalars['String']['input'];
}>;


export type CreateSubbusinessUnitMutation = { __typename?: 'Mutation', createSubbusinessUnit?: { __typename?: 'SubBusinessUnitCreateMutation', success?: boolean | null, message?: string | null, subBusinessUnit?: { __typename?: 'SubBusinessUnitType', id: any, subBusinessUnitName: string, subBusinessUnitDescription: string } | null } | null };

export type CreateApiMonitorMutationVariables = Exact<{
  input: MonitoredApiInput;
}>;


export type CreateApiMonitorMutation = { __typename?: 'Mutation', createApiMonitor?: { __typename?: 'ApiMonitorCreateMutation', success?: boolean | null, message?: string | null, monitoredApi?: { __typename?: 'MoniterApiType', id: any, apiName?: string | null, apiUrl: string } | null } | null };

export type UpdateApiMonitorMutationVariables = Exact<{
  input?: InputMaybe<MonitoredApiInput>;
  apiMonitorId: Scalars['UUID']['input'];
  isApiActive: Scalars['Boolean']['input'];
}>;


export type UpdateApiMonitorMutation = { __typename?: 'Mutation', updateApiMonitor?: { __typename?: 'ApiMonitorUpdateMutation', success?: boolean | null, message?: string | null, monitoredApi?: { __typename?: 'MoniterApiType', id: any, apiName?: string | null, apiUrl: string, isApiActive: boolean } | null } | null };

export type GetBusinessUnitQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBusinessUnitQuery = { __typename?: 'Query', businessUnit?: Array<{ __typename?: 'BusinessUnitType', id: any, businessUnitName: string } | null> | null };

export type GetSubBusinessUnitPerBusinessUnitQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetSubBusinessUnitPerBusinessUnitQuery = { __typename?: 'Query', subBusinessUnitPerBusinessUnit?: Array<{ __typename?: 'SubBusinessUnitType', id: any, subBusinessUnitName: string } | null> | null };

export type GetApiTypeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetApiTypeQuery = { __typename?: 'Query', methodTypeChoices?: Array<{ __typename?: 'methodTypeChoice', key: string , value: string } | null> | null };

export type GetAuthValueQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAuthValueQuery = { __typename?: 'Query', authTypeChoices?: Array<{ __typename?: 'AuthTypeChoice', key: string, value: string } | null> | null };

export type ValidateApiQueryVariables = Exact<{
  apiUrl: Scalars['String']['input'];
  methodType: Scalars['String']['input'];
  headers?: InputMaybe<Scalars['String']['input']>;
  requestBody?: InputMaybe<Scalars['String']['input']>;
}>;


export type ValidateApiQuery = { __typename?: 'Query', validateApi?: { __typename?: 'validateApiResponse', status?: number | null, success?: boolean | null, message?: string | null } | null };

export type GetAllMetricsQueryVariables = Exact<{
  apiMonitoringId: Scalars['UUID']['input'];
  fromDate?: InputMaybe<Scalars['DateTime']['input']>;
  toDate?: InputMaybe<Scalars['DateTime']['input']>;
  timeRange?: InputMaybe<Scalars['Int']['input']>;
  timeUnit?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetAllMetricsQuery = { __typename?: 'Query', getAllMetrices?: Array<{ __typename?: 'ApiMetricesType', apiName?: string | null, apiUrl: string, avg_response_size?: number | null, avg_latency?: number | null, isApiActive: boolean, success_count?: number | null, availability_uptime?: number | null, avg_first_byte_time?: number | null, error_count?: number | null, methodType: ApimonitoringMonitoredApiMethodtypeChoices, success_rates?: number | null, error_rates?: number | null, assertionAndLimit: Array<{ __typename?: 'AssertionAndLimitQueryType', degradedResponseTime?: number | null, failedResponseTime?: number | null }>, response_time?: Array<{ __typename?: 'responseTimeType', responsetime?: number | null, timestamp?: any | null, success?: boolean | null } | null> | null, percentile_50?: { __typename?: 'percentileResponseType', currPercentileResTime?: number | null, percentageDiff?: number | null } | null, percentile_90?: { __typename?: 'percentileResponseType', currPercentileResTime?: number | null, percentageDiff?: number | null } | null, percentile_99?: { __typename?: 'percentileResponseType', percentageDiff?: number | null, currPercentileResTime?: number | null } | null } | null> | null };

export type GetServiceByIdQueryVariables = Exact<{
  serviceId: Scalars['UUID']['input'];
}>;


export type GetServiceByIdQuery = { __typename?: 'Query', getServiceById?: { __typename?: 'MoniterApiType', apiName?: string | null, apiUrl: string, methodType: ApimonitoringMonitoredApiMethodtypeChoices, requestBody?: string | null, id: any, headers?: any | null, businessUnit: { __typename?: 'BusinessUnitType', id: any, businessUnitName: string }, subBusinessUnit: { __typename?: 'SubBusinessUnitType', id: any, subBusinessUnitName: string } } | null };

export type ValidateTeamsChannelQueryVariables = Exact<{
  channelUrl: Scalars['String']['input'];
}>;


export type ValidateTeamsChannelQuery = { __typename?: 'Query', validateTeamsChannel?: { __typename?: 'validateApiResponse', message?: string | null, success?: boolean | null, status?: number | null } | null };
