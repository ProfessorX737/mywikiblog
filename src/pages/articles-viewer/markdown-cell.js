import React from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import MarkdownEditor from "./markdown-editor";
import RenderMarkdown2 from "./render-markdown2";
import {
  setCellContent,
} from "../../redux/actions";

function MarkdownCell(props) {
  const cellData = {
    content: "*fetching content...*",
    ...props.cellData
  }
  const onEditorKeyDown = evt => {
    if (!(evt.shiftKey && evt.key === "Enter")) {
      evt.stopPropagation();
    }
  }
  const onContentChange = content => {
    props.setCellContent({
      cellId: cellData.cellId,
      content
    })
  }
  return (
    <React.Fragment>
      {cellData.isEditing ? (
        <MarkdownEditor
          initialCode={cellData.content}
          renderStyle={{ padding: '0 0.5em 0 0.5em' }}
          onContentChange={content => { onContentChange(content) }}
          wrapperProps={{
            onKeyDown: evt => { onEditorKeyDown(evt) },
          }}
        />
      ) : (
          <RenderMarkdown2 source={cellData.content} />
        )}
    </React.Fragment>
  )
}

MarkdownCell.propTypes = {
  view: PropTypes.object.isRequired,
  cellData: PropTypes.object.isRequired
}

export default connect(
  state => ({ cells: state.cells }),
  { setCellContent }
)(MarkdownCell);