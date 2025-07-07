import {
    type DocumentByInfo,
    type ExpressionOrValue,
    type FieldPaths,
    type FieldTypeFromFieldPath,
    type FilterBuilder,
    type GenericTableInfo,
} from 'convex/server';
import type { Value } from 'convex/values';

export function qFieldIn<
    TableInfo extends GenericTableInfo,
    FieldPath extends FieldPaths<TableInfo>,
>(
    q: FilterBuilder<TableInfo>,
    field: FieldPath,
    values: ExpressionOrValue<FieldTypeFromFieldPath<
        DocumentByInfo<TableInfo>,
        FieldPath
    > | null>[]
) {
    return q.or.apply(values.map((value) => q.eq(q.field(field), value)));
}

export function qIn<
    TableInfo extends GenericTableInfo,
    T extends Value | undefined,
>(
    q: FilterBuilder<TableInfo>,
    l: ExpressionOrValue<T>,
    values: ExpressionOrValue<T>[]
) {
    return q.or.apply(values.map((value) => q.eq(l, value)));
}
