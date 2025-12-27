import React, { useEffect } from 'react';
import { useLaunchpoolStore } from '../stores/launchpoolStore';
import { usePolkadotApi } from '../hooks/usePolkadotApi';

/**
 * Component to initialize the Launchpool store with the API instance
 */
export const LaunchpoolInitializer: React.FC = () => {
    const { api } = usePolkadotApi();
    const init = useLaunchpoolStore((state) => state.init);
    const storeApi = useLaunchpoolStore((state) => state.api);

    useEffect(() => {
        if (api && !storeApi) {
            init(api);
            console.log("Launchpool store initialized with API");
        }
    }, [api, storeApi, init]);

    return null;
};
