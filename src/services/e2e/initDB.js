import { openDB } from "idb";

export async function initDB() {
    const db = await openDB('secure-chat-db', 1, {
        upgrade(db) {
            //     → chia nhiều file thoải mái,
            // nhưng upgrade() vẫn là 1 hàm duy nhất.
            // Tạo store chỉ khi chưa tồn tại
            if (!db.objectStoreNames.contains('identity_keys')) {
                db.createObjectStore('identity_keys', { keyPath: 'username' });
            }

            if (!db.objectStoreNames.contains('prekeys')) {
                db.createObjectStore('prekeys', { keyPath: 'username' });
            }
            if (!db.objectStoreNames.contains('sessions')) {
                db.createObjectStore('sessions', { keyPath: 'conversationId' });
            }

            if (!db.objectStoreNames.contains('backup_keys')) {
                db.createObjectStore('backup_keys', { keyPath: 'username' });
            }
            if (!db.objectStoreNames.contains('ephemeral_keys')) {
                db.createObjectStore('ephemeral_keys', { keyPath: 'conversationId' });
            }
        },
    });
    return db
}