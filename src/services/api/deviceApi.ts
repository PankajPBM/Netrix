import { baseApi } from './baseApi';
import { Device } from '@/types/models';

export interface GetDevicesParams {
  search?: string;
  status?: string;
  group?: string;
  os?: string;
  isFavorite?: boolean;
}

export const deviceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDevices: builder.query<Device[], GetDevicesParams | void>({
      query: (params) => ({
        url: '/devices',
        params: params || {},
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Devices' as const, id })),
              { type: 'Devices', id: 'LIST' },
            ]
          : [{ type: 'Devices', id: 'LIST' }],
    }),

    getDeviceById: builder.query<Device, string>({
      query: (id) => `/devices/${id}`,
      providesTags: (_res, _err, id) => [{ type: 'Devices', id }],
    }),

    toggleDeviceFavorite: builder.mutation<Device, string>({
      query: (id) => ({
        url: `/devices/${id}/favorite`,
        method: 'PATCH',
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: 'Devices', id },
        { type: 'Devices', id: 'LIST' },
      ],
    }),

    registerDevice: builder.mutation<Device, { name: string; alias: string; group: string; osType: 'windows' | 'mac' | 'linux' | 'android' }>({
      query: (body) => ({
        url: '/devices/register',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Devices', id: 'LIST' }],
    }),

    deleteDevice: builder.mutation<string, string>({
      query: (id) => ({
        url: `/devices/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Devices', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetDevicesQuery,
  useGetDeviceByIdQuery,
  useToggleDeviceFavoriteMutation,
  useRegisterDeviceMutation,
  useDeleteDeviceMutation,
} = deviceApi;
