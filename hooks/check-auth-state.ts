import {pb} from "@/lib/pocketbase";
import {useRouter} from 'next/navigation'; // For App Router
// OR import { useRouter } from 'next/router'; // For Pages Router
import {redirect} from 'next/navigation'; // For server-side redirects

export const checkAuthState = async () => {
    try {
        // Check if we're on the client side
        if (typeof window !== 'undefined') {
            if (!pb.authStore.isValid) {
                window.location.href = '/auth/login';
                return false;
            } else if (!pb.authStore.model?.verified) {
                window.location.href = '/auth/verification';
                return false;
            } else {
                return true;
            }
        } else {
            // Server-side - just return auth state without redirecting
            return pb.authStore.isValid &&
                pb.authStore.model?.verified &&
                pb.authStore.model?.sudo;
        }
    } catch (error) {
        console.error('Failed to check auth state:', error);
        return false;
    }
};

const checkSudoOfId = async (id: string) => {
    try {
        const model = await pb.collection('users').getOne(id);
        return !!model?.sudo;
    } catch (error) {
        console.error('Failed to check sudo state:', error);
        return false;
    }
}

export const checkSudoState = async () => {
    try {
        if (await checkAuthState() && await checkSudoOfId(pb.authStore.model?.id)) {
            return true;
        }

        if (typeof window !== 'undefined') {
            window.location.href = '/counter/';
        }
        return false;
    } catch (error) {
        console.error('Failed to check sudo state:', error);
        return false;
    }
}