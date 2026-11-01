import { baseApi } from './baseApi';
import { MOCK_DEVICES, MockDevice } from '../mock/mockData';

const isMockEnabled = import.meta.env.VITE_ENABLE_MOCK_API === 'true';

// In-memory working copy for mutations during mock session
let workingDevices: MockDevice[] = [...MOCK_DEVICES];

export interface GetDevicesParams {
  search?: string;
  status?: string;
  group?: string;
  os?: string;
  isFavorite?: boolean;
}

export const deviceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDevices: builder.query<MockDevice[], GetDevicesParams | void>({
      queryFn: async (params) => {
        if (isMockEnabled) {
          await new Promise((resolve) => setTimeout(resolve, 150));
          let filtered = [...workingDevices];

          if (params?.search) {
            const query = params.search.toLowerCase();
            filtered = filtered.filter(
              (d) =>
                d.name.toLowerCase().includes(query) ||
                d.netrixId.toLowerCase().includes(query) ||
                d.alias.toLowerCase().includes(query) ||
                d.ipAddress.toLowerCase().includes(query)
            );
          }

          if (params?.status && params.status !== 'all') {
            filtered = filtered.filter((d) => d.status === params.status);
          }

          if (params?.group && params.group !== 'all') {
            filtered = filtered.filter((d) => d.group === params.group);
          }

          if (params?.os && params.os !== 'all') {
            filtered = filtered.filter((d) => d.osType === params.os);
          }

          if (params?.isFavorite !== undefined) {
            filtered = filtered.filter((d) => d.isFavorite === params.isFavorite);
          }

          return { data: filtered };
        }
        return { data: [] };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Devices' as const, id })),
              { type: 'Devices', id: 'LIST' },
            ]
          : [{ type: 'Devices', id: 'LIST' }],
    }),

    getDeviceById: builder.query<MockDevice, string>({
      queryFn: async (id) => {
        if (isMockEnabled) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          const device = workingDevices.find((d) => d.id === id);
          if (!device) {
            return { error: { status: 404, data: 'Device not found' } };
          }
          return { data: device };
        }
        return { error: { status: 501, data: 'Not implemented' } };
      },
      providesTags: (_result, _error, id) => [{ type: 'Devices', id }],
    }),

    toggleDeviceFavorite: builder.mutation<MockDevice, string>({
      queryFn: async (id) => {
        if (isMockEnabled) {
          await new Promise((resolve) => setTimeout(resolve, 120));
          const device = workingDevices.find((d) => d.id === id);
          if (device) {
            device.isFavorite = !device.isFavorite;
            return { data: { ...device } };
          }
          return { error: { status: 404, data: 'Device not found' } };
        }
        return { error: { status: 501, data: 'Not implemented' } };
      },
      invalidatesTags: (_result, _error, id) => [
        { type: 'Devices', id },
        { type: 'Devices', id: 'LIST' },
      ],
    }),

    registerDevice: builder.mutation<MockDevice, { name: string; alias: string; group: string; osType: 'windows' | 'mac' | 'linux' | 'android' }>({
      queryFn: async (newDevice) => {
        if (isMockEnabled) {
          await new Promise((resolve) => setTimeout(resolve, 300));
          const randomNetrixId = `${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)}`;
          const created: MockDevice = {
            id: `dev_${Date.now()}`,
            netrixId: randomNetrixId,
            name: newDevice.name,
            alias: newDevice.alias || newDevice.name,
            os: newDevice.osType === 'windows' ? 'Windows 11 Enterprise' : newDevice.osType === 'mac' ? 'macOS Sequoia 15.1' : 'Linux Kernel 6.8',
            osType: newDevice.osType,
            version: 'NETRIX Host 3.2.0',
            status: 'online',
            ipAddress: '10.200.15.' + Math.floor(10 + Math.random() * 200),
            publicIp: '198.51.100.99',
            group: newDevice.group || 'Default Fleet',
            location: 'Provisioned Endpoint',
            lastSeen: 'Live Now',
            uptime: '0h 02m',
            cpuUsage: 4,
            ramUsage: 19,
            diskUsage: 25,
            unattendedAccess: true,
            isFavorite: false,
          };
          workingDevices.unshift(created);
          return { data: created };
        }
        return { error: { status: 501, data: 'Not implemented' } };
      },
      invalidatesTags: [{ type: 'Devices', id: 'LIST' }],
    }),

    deleteDevice: builder.mutation<string, string>({
      queryFn: async (id) => {
        if (isMockEnabled) {
          await new Promise((resolve) => setTimeout(resolve, 200));
          workingDevices = workingDevices.filter((d) => d.id !== id);
          return { data: id };
        }
        return { error: { status: 501, data: 'Not implemented' } };
      },
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
