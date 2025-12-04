export function toCamel<T>(input: T): T {
    if (Array.isArray(input)) {
        return input.map((v) => toCamel(v)) as T;
    }

    if (input !== null && typeof input === "object") {
        const entries = Object.entries(input).map(([key, value]) => {
            let camelKey = key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());

            if (camelKey === "linkUrl") camelKey = "linkURL";

            return [camelKey, toCamel(value)];
        });

        return Object.fromEntries(entries) as T;
    }

    return input;
}