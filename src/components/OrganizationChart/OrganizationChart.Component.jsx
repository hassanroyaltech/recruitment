import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Tree, TreeNode } from 'react-organizational-chart';
import './OrganizationChart.Style.scss';

const OrganizationChartComponent = ({
  dataset,
  uniqueKey,
  rootText,
  getTitle,
  getIncludeSearch,
  // rootImage,
  isWithGridBackground,
}) => {
  const getNodes = useMemo(
    () =>
      (data = dataset, parentIndex = 1) =>
        data
          .filter((item) => !item.is_deleted)
          .map((item) => (
            <React.Fragment key={`treeNode${item[uniqueKey]}`}>
              {(item.children && item.children.length > 0 && (
                <TreeNode
                  label={
                    <div
                      className={`nodes-wrapper${
                        (getIncludeSearch
                          && getIncludeSearch(item)
                          && ' is-include-search')
                        || ''
                      }${
                        (parentIndex % 4 === 0 && ' fourth-nodes')
                        || (parentIndex % 3 === 0 && ' third-nodes')
                        || (parentIndex % 2 === 0 && ' second-nodes')
                        || (parentIndex % 1 === 0 && ' first-node')
                        || ''
                      }`}
                    >
                      {getTitle && getTitle(item)}
                    </div>
                  }
                >
                  {getNodes(item.children, parentIndex + 1)}
                </TreeNode>
              )) || (
                <TreeNode
                  label={
                    <div
                      className={`nodes-wrapper${
                        (getIncludeSearch
                          && getIncludeSearch(item)
                          && ' is-include-search')
                        || ''
                      }${
                        (parentIndex % 4 === 0 && ' fourth-nodes')
                        || (parentIndex % 3 === 0 && ' third-nodes')
                        || (parentIndex % 2 === 0 && ' second-nodes')
                        || (parentIndex % 1 === 0 && ' first-node')
                        || ''
                      }`}
                    >
                      {getTitle && getTitle(item)}
                    </div>
                  }
                />
              )}
            </React.Fragment>
          )),
    [dataset, getIncludeSearch, getTitle, uniqueKey],
  );
  return (
    <div
      className={`organization-chart-wrapper component-wrapper${
        (isWithGridBackground && ' is-with-grid-background') || ''
      }`}
    >
      <Tree
        label={rootText}
        lineBorderRadius="0"
        lineColor="var(--c-primary, #272c6a)"
        lineHeight="30px"
        lineWidth="2px"
        nodePadding="5px"
      >
        {getNodes()}
      </Tree>
    </div>
  );
};

OrganizationChartComponent.propTypes = {
  dataset: PropTypes.arrayOf(PropTypes.instanceOf(Object)).isRequired,
  uniqueKey: PropTypes.string,
  rootText: PropTypes.string,
  getTitle: PropTypes.func,
  getIncludeSearch: PropTypes.func,
  isWithGridBackground: PropTypes.bool,
};

OrganizationChartComponent.defaultProps = {
  isWithGridBackground: false,
  uniqueKey: 'uuid',
  rootText: undefined,
  getTitle: undefined,
  getIncludeSearch: undefined,
};

export default OrganizationChartComponent;
