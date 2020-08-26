import React from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import MarkdownEditor from "./markdown-editor";
import RenderMarkdown2 from "./render-markdown2";
import {
  setCellContent,
} from "./redux/actions";

function MarkdownCell(props) {
  const cellData = {
    content: "*fetching data...",
    ...props.cells[props.cellId],
    ...props.view.tabsView[props.view.currTabId]?.[props.cellVid]
  }
  const onEditorKeyDown = evt => {
    evt.stopPropagation();
  }
  const onContentChange = content => {
    props.setCellContent({
      cellId: props.cellId,
      content
    })
  }
  return (
    <React.Fragment>
      {cellData.isEditing ? (
      <MarkdownEditor
        initialCode={cellData.content}
        renderStyle={{ padding: '0 0.5em 0 0.5em' }}
        onContentChange={content => {onContentChange(content)}}
        wrapperProps={{
          onKeyDown: evt => {onEditorKeyDown(evt)},
        }}
      />
      ) : (
        <RenderMarkdown2 source={cellData.content} style={{ padding: "0 0.5em 0 0.5em", border: '1px solid white' }} />
      )}
    </React.Fragment>
  )
}

MarkdownCell.propTypes = {
  view: PropTypes.object.isRequired,
  cellId: PropTypes.string.isRequired,
  cellVid: PropTypes.string.isRequired,
}

export default connect(
  state => ({ cells: state.cells }),
  { setCellContent }
)(MarkdownCell);