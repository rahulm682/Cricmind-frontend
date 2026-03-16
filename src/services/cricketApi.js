import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../config';

export const cricketApi = createApi({
  reducerPath: 'cricketApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/api/cricket/`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['LiveMatches', 'Player', 'News', 'Chats'],
  endpoints: (builder) => ({

    registerUser: builder.mutation({
      query: (userData) => ({
        url: 'auth/register/',
        method: 'POST',
        body: userData,
      }),
    }),

    loginUser: builder.mutation({
      query: (credentials) => ({
        url: 'auth/login/',
        method: 'POST',
        body: credentials,
      }),
    }),

    getChats: builder.query({
      query: () => 'chats/',
      providesTags: ['Chats'],
    }),

    saveChat: builder.mutation({
      query: (chatData) => ({
        url: 'chats/',
        method: 'POST',
        body: chatData,
      }),
      invalidatesTags: ['Chats'],
    }),

    deleteChat: builder.mutation({
      query: (chatId) => ({
        url: 'chats/',
        method: 'DELETE',
        body: { id: chatId },
      }),
      invalidatesTags: ['Chats'],
    }),

    getLiveMatches: builder.query({
      query: () => 'live-matches/',
      providesTags: ['LiveMatches'],
    }),

    getPlayerProfile: builder.query({
      query: (name) => `player/?name=${encodeURIComponent(name)}`,
      keepUnusedDataFor: 300,
      providesTags: ['Player'],
    }),

    getNews: builder.query({
      query: (searchTerm) => `news/?q=${encodeURIComponent(searchTerm)}`,
      providesTags: ['News'],
    }),

    askAi: builder.mutation({
      query: (payload) => ({
        url: 'ask-ai/',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: payload,
      }),
    }),

  }),
});

export const {
  useGetLiveMatchesQuery,
  useGetPlayerProfileQuery,
  useGetNewsQuery,
  useAskAiMutation,
  useRegisterUserMutation,
  useLoginUserMutation,
  useGetChatsQuery,
  useSaveChatMutation,
  useDeleteChatMutation
} = cricketApi;