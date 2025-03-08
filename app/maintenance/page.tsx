'use client';

import {useEffect, useState} from 'react';
import {AuthNav} from '@/components/authNav';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Maintenance} from '@/lib/types/maintenance';
import {Input} from '@/components/ui/input';
import {pb} from '@/lib/pocketbase';

export default function MaintenancePage() {
    const [maintenance, setMaintenance] = useState<Maintenance | null>(null);
    const [reason, setReason] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [errorCountRef] = useState(() => ({current: 0}));

    useEffect(() => {
        fetchMaintenanceStatus();
        // Check admin status only on client side
        const user = pb.authStore.model;
        setIsAdmin(user?.extra_sudo === true);
    }, []);


    const fetchMaintenanceStatus = async () => {
        let success = false;
        while (!success && errorCountRef.current < 2) {
            try {
                const records = await pb.collection('maintenance').getList(1, 1, {
                    sort: '-created'
                });
                success = true;
                if (records.items.length > 0) {
                    const maintenanceRecord = records.items[0];
                    if (maintenanceRecord.enabled) {
                        errorCountRef.current = 0;
                        setMaintenance(maintenanceRecord as unknown as Maintenance);
                        return;
                    }
                }
                errorCountRef.current = 0;
                setMaintenance(null);
                return;
            } catch (error) {
                console.error('Error fetching maintenance status:', error);
                errorCountRef.current++;
                if (errorCountRef.current >= 2) {
                    const maintenance = {
                        enabled: true,
                        updated: new Date(),
                        reason: 'Error fetching maintenance status'
                    };
                    setMaintenance(maintenance as unknown as Maintenance);
                    break;
                }
            }
        }
    };

    const toggleMaintenance = async () => {
        if (!isAdmin) return;
        setIsLoading(true);

        try {
            const newState = !maintenance?.enabled;
            const currentUser = pb.authStore.model;
            await pb.collection('maintenance').create({
                user: currentUser?.id,
                reason: reason || undefined,
                enabled: newState
            });
            await fetchMaintenanceStatus();
            setReason('');
        } catch (error) {
            console.error('Error toggling maintenance mode:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <AuthNav/>
            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>Maintenance Mode</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <span className="font-medium">Current Status:</span>
                            <span
                                className={`px-2 py-1 rounded ${maintenance?.enabled ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}
                            >
                {maintenance?.enabled ? 'Maintenance Mode Active' : 'System Operational'}
              </span>
                        </div>
                        {maintenance && (
                            <div className="text-sm text-gray-600">
                                <p>Last updated: {new Date(maintenance.updated).toLocaleString()}</p>
                                {maintenance.reason && <p>Reason: {maintenance.reason}</p>}
                            </div>
                        )}
                        {isAdmin && (
                            <div className="space-y-2">
                                <Input
                                    placeholder="Reason for maintenance (optional)"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                />
                                <Button
                                    onClick={toggleMaintenance}
                                    disabled={isLoading}
                                    variant={maintenance?.enabled ? 'default' : 'destructive'}
                                >
                                    {isLoading ? 'Processing...' : maintenance?.enabled ? 'Deactivate Maintenance Mode' : 'Activate Maintenance Mode'}
                                </Button>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}