import * as classNames from 'classnames';
import * as React from 'react';

import Fade from '@material-ui/core/Fade';
import { StyleRulesCallback, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Check from '@material-ui/icons/Check';

import Grid from 'src/components/Grid';

type CSSClasses =
'root'
| 'icon'
| 'checked'
| 'flex'
| 'heading'
| 'innerGrid'
| 'subheading'
| 'disabled'
| 'showCursor';

const styles: StyleRulesCallback<CSSClasses> = (theme: Theme & Linode.Theme) => ({
  '@keyframes fadeIn': {
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  },
  root: {
    marginBottom: theme.spacing.unit * 2,
    minWidth: 200,
    padding: theme.spacing.unit * 2,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    outline: 0,
    '&.checked $innerGrid': {
      borderColor: theme.palette.primary.main,
      '& span': {
        color: theme.palette.primary.main,
      },
    },
    '&:focus $innerGrid': {
      outline: `1px dotted ${theme.color.focusBorder}`,
    },
    '& .w100': {
      width: '100%',
    },
    '& [class^="fl-"]': {
      transition: 'color 225ms ease-in-out',
    },

  },
  icon: {
    '& svg, & span': {
      fontSize: '32px',
      color: '#939598',
    },
    '& img': {
      maxHeight: '32px',
      maxWidth: '32px',
    },
  },
  checked: {
    display: 'flex',
    animation: 'fadeIn 225ms ease-in-out forwards',
    '& svg': {
      borderRadius: '16px',
      border: '1px solid',
      borderColor: theme.palette.primary.main,
      fontSize: '16px',
      color: theme.palette.primary.main,
    },
  },
  showCursor: {
    cursor: 'pointer',
  },
  disabled: {
    cursor: 'not-allowed',
    '& $innerGrid': {
      opacity: .4,
    },
  },
  heading: {
    fontWeight: 700,
    fontSize: '1em',
    color: theme.color.headline,
  },
  subheading: {
    fontSize: '0.8em',
    color: theme.palette.text.primary,
  },
  innerGrid: {
    width: '100%',
    minHeight: 70,
    backgroundColor: theme.bg.offWhite,
    border: '1px solid ' + `${theme.bg.main}`,
    transition: `${'background-color 225ms ease-in-out, '}
    ${'border-color 225ms ease-in-out'}`,
    '&:hover': {
      backgroundColor: theme.bg.main,
      borderColor: theme.color.border2,
    },
    [theme.breakpoints.up('sm')]: {
      padding: 8,
    },
  },
  flex: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    '&> div': {
      lineHeight: 1.3,
    },
  },
});

const styled = withStyles(styles, { withTheme: true });

export interface Props {
  onClick?: (e: React.SyntheticEvent<HTMLElement>) => void;
  onKeyPress?: (e: React.SyntheticEvent<HTMLElement>) => void;
  renderIcon?: () => JSX.Element;
  heading: string;
  subheadings: (string|undefined)[];
  checked?: boolean;
  disabled?: boolean;
  tooltip?: string;
}

type CombinedProps = Props & WithStyles<CSSClasses>;
interface WithTooltipProps {
  title? : string;
  render: () => JSX.Element;
}

const WithTooltip: React.StatelessComponent<WithTooltipProps> = ({ title, render }) => (title)
  ? (<Tooltip title={title} className="w100">{ render() }</Tooltip>)
  : render();

const SelectionCard: React.StatelessComponent<CombinedProps> = (props) => {
  const {
    renderIcon,
    heading,
    subheadings,
    classes,
    checked,
    disabled,
    tooltip,
    onClick,
  } = props;

  return (
      <Grid
        item
        xs={12}
        sm={6}
        md={4}
        xl={3}
        tabIndex={0}
        className={
          classNames({
            [classes.root]: true,
            checked: checked === true,
            [classes.disabled]: disabled === true,
            [classes.showCursor]: onClick && !disabled,
            selectionCard: true,
          })
        }
        { ...((onClick && !disabled) && { onClick, onKeyPress: onClick }) }
        data-qa-selection-card
      >
        <WithTooltip
          title={tooltip}
          render={() => (
            <Grid
              container
              alignItems="center"
              className={classes.innerGrid}
            >
              {renderIcon &&
                <Grid item className={classes.icon}>
                  {renderIcon()}
                </Grid>
              }
              <Grid item className={classes.flex}>
                <div className={classes.heading} data-qa-select-card-heading={heading}>
                  {heading}
                </div>
                {subheadings.map((subheading, idx) => {
                  return (
                    <div key={idx} className={classes.subheading}
                      data-qa-select-card-subheading={subheading}>
                      {subheading}
                    </div>
                  );
                })}
              </Grid>

              {checked &&
              <Fade in={checked}>
                <Grid
                  item
                  className={`${classes.icon} ${classes.checked}`}
                  data-qa-checked={checked}
                >
                  <Check />
                </Grid>
              </Fade>
              }
            </Grid>
          )}
        />
      </Grid>
  );
};

export default styled<Props>(SelectionCard);
