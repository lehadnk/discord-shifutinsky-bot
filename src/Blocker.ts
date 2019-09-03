export class Blocker {
    private blocked = new Map<string, void>();

    public block(id: string): void {
        this.blocked.set(id);
    }

    public unblock(id: string): void {
        this.blocked.delete(id);
    }

    public isBlocked(id: string): boolean {
        return this.blocked.has(id);
    }
}