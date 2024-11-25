import styled from 'styled-components';

export const Container = styled.div`
  background-color: ${(props) =>
    props.isDraggingOver ? 'var(--lighter)' : 'transparent'};
  min-height: 250px;
  overflow: auto;
  transition: background-color 0.33s ease;
`;

export const ColumnContainer = styled.div`
  background-color: ${(props) => (props.isDragging ? 'var(--lighter)' : 'white')};
  border: 1px solid rgb(222, 226, 230);
  margin: 0px 10px;
  padding: 15px;
  min-width: 254px;
`;

export const StageBarWrapper = styled.div`
  align-items: center;
  display: flex;
`;

export const StageInfo = styled.div`
  display: flex;
  max-width: 70%;
  & > * {
    padding: 2px 4px;
  }
`;

export const StageActions = styled.div`
  display: inline-flex;
`;

export const Checkbox = styled.div`
  display: flex;
`;

export const InfiniteScrollWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
`;

export const StageTitleWrapper = styled.div`
  color: black;
  font-weight: bold;
  &:hover {
    background: #f7fafc;
  }
`;
