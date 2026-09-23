import React, { memo, forwardRef, useImperativeHandle } from 'react';
import * as Blockly from 'blockly';
import { useBlockly } from '../hooks/useBlockly';
import '../styles/BlocklyTheme.css';

/**
 * BlocklyEditor isolates the Blockly injection and workspace management.
 * Using React.memo ensures that re-renders of the parent (e.g., IDE.jsx due to sensor updates)
 * do not cause React to Reconciliation the Blockly container, which can break 
 * Blockly's internal event listeners and DOM state.
 */
const BlocklyEditor = memo(forwardRef(({ project, onCodeChange }, ref) => {
    const { blocklyDiv, pythonCode, workspace } = useBlockly(project);

    useImperativeHandle(ref, () => ({
        loadXml: (xmlString) => {
            console.log('[BlocklyEditor] Loading XML into workspace...', workspace.current ? 'Workspace Ready' : 'Workspace MISSING');
            if (workspace && workspace.current) {
                try {
                    workspace.current.clear();
                    const dom = Blockly.utils.xml.textToDom(xmlString);
                    Blockly.Xml.domToWorkspace(dom, workspace.current);
                    console.log('[BlocklyEditor] XML loaded successfully');
                } catch (e) {
                    console.error('[BlocklyEditor] Error loading XML:', e);
                }
            }
        },
        getXml: () => {
            if (workspace && workspace.current) {
                try {
                    const dom = Blockly.Xml.workspaceToDom(workspace.current);
                    return Blockly.Xml.domToPrettyText(dom);
                } catch (e) {
                    console.error('[BlocklyEditor] Error serializing workspace XML:', e);
                }
            }
            return '';
        }
    }));

    // Sync code back to parent if needed, but cautiously to avoid loop
    React.useEffect(() => {
        if (onCodeChange) {
            onCodeChange(pythonCode);
        }
    }, [pythonCode, onCodeChange]);

    return (
        <div
            style={{
                position: 'relative',
                overflow: 'hidden',
                height: '100%',
                width: '100%',
                background: '#fff'
            }}
        >
            <div
                ref={blocklyDiv}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0
                }}
            />
        </div>
    );
}, (prevProps, nextProps) => {
    // Only re-render if the project ID or blocks content actually change.
    // This prevents re-renders when parent state (like sensorValue) changes.
    return (
        prevProps.project?.id === nextProps.project?.id &&
        prevProps.project?.blocks === nextProps.project?.blocks
    );
}));

BlocklyEditor.displayName = 'BlocklyEditor';

export default BlocklyEditor;
