### 基于 React 和 TypeScript 的模糊筛选树结构

在使用 React 和 TypeScript 构建应用时，常常需要对树结构的数据进行模糊筛选。

#### 示例代码

```tsx
const filterTree = (data: ITreeData[], treeSearch: string) => {
  const filteredKeys: React.Key[] = [];
  const filteredTree: ITreeData[] = [];

  const filterNodes = (nodes: ITreeData[]) => {
    nodes.forEach((node: ITreeData) => {
      const nodeTitle = String(node.title);

      if (nodeTitle.toLowerCase().includes(treeSearch.toLowerCase())) {
        if (filteredKeys.indexOf(node.key) === -1) {
          filteredKeys.push(node.key);
        }

        let inFilteredTree: boolean = false;

        const checkedSameKey = (data: ITreeData[], key: string) => {
          data.forEach((item) => {
            if (item.key === key) {
              return (inFilteredTree = true);
            }

            if (item.children) {
              checkedSameKey(item.children, key);
            }
          });
        };

        checkedSameKey(filteredTree, node.key);

        if (!inFilteredTree) {
          filteredTree.push(node);
        }
      }

      if (node.children) {
        filterNodes(node.children);
      }
    });
  };

  filterNodes(data);

  return { filteredKeys, filteredTree };
};

// 简单优化
const filterTreeb = <T extends ITreeData>(
    data: T[],
    treeSearch: string
  ): {
    filteredKeys: React.Key[];
    filteredTree: T[];
  } => {
    const filteredKeys = new Set<React.Key>();

    const filteredTree: T[] = [];

    const searchLower = treeSearch.toLowerCase();

    const hasSameKey = (data: T[], key: React.Key): boolean =>
        data.some(
          (item) =>
            item.key === key ||
            (item.children && hasSameKey(item.children as T[], key))
        );

    const filterNodes = (nodes: T[]) => {
      nodes.forEach((node) => {
        const isMatch = String(node.title).toLowerCase().includes(searchLower);

        if (
          isMatch &&
          !filteredKeys.has(node.key) &&
          !hasSameKey(filteredTree, node.key)
        ) {
          filteredKeys.add(node.key);

          filteredTree.push(node);
        }

        node.children && filterNodes(node.children as T[]);
      });
    };

    filterNodes(data);

    return { filteredKeys: Array.from(filteredKeys), filteredTree };
  };
  
     
```

#### 解释

1. **函数定义**：
   - `filterTree` 函数接收一个树结构数据数组 `data` 作为参数，返回筛选后的键列表和树结构。

2. **数据结构**：
   - `filteredKeys` 是一个存储被筛选节点键的数组。
   - `filteredTree` 是一个存储被筛选节点的树结构数组。

3. **递归筛选节点**：
   - 内部函数 `filterNodes` 递归地遍历节点数组 `nodes`，检查每个节点的标题是否包含搜索关键字。

4. **模糊匹配**：
   - 使用 `String(node.title).toLowerCase().includes(treeSearch.toLowerCase())` 进行不区分大小写的模糊匹配。

5. **记录匹配节点**：
   - 如果节点符合条件且其键尚未记录在 `filteredKeys` 中，则将其键加入 `filteredKeys`。
   - 使用 `checkedSameKey` 函数递归地检查 `filteredTree` 中是否已经存在该节点，避免重复添加。
   -  `checkedSameKey` 函数当发现存在就直接return，反之继续递归
   
6. **递归子节点**：
   - 如果节点包含子节点，则递归调用 `filterNodes` 处理子节点。

7. **返回结果**：
   - 最终返回一个对象，包含 `filteredKeys` 和 `filteredTree`。
   - 该过滤`filteredTree`返回的为配对节点和其所有子节点，不包括父节点和其展开
   - `filteredKeys`配合antd的tree组件自动展开

#### 使用

```
const {filteredTree, filteredKeys} = filterTree(treeData, search);
```

