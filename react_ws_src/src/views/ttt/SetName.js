import React, { Component } from 'react';
import { AVATAR_OPTS } from './avatarOptions';

export default class SetName extends Component {
  constructor(props) {
    super(props);

    this.avatar_opts = AVATAR_OPTS;
    const initialAvatar = props.initialAvatar && this.avatar_opts.indexOf(props.initialAvatar) !== -1
      ? props.initialAvatar
      : this.avatar_opts[0];
    this.state = {
      avatar: initialAvatar,
      name_error: '',
    };
  }

  //	------------------------	------------------------	------------------------

  render() {
    const { avatar, name_error } = this.state;

    return (
      <div id="SetName">
        <h1>Set Name</h1>
        <p className="set_name_subtitle">
          Pick a name and avatar for this match.
        </p>

        <div>
          <div ref="nameHolder" className="input_holder">
            <label>Name </label>
            <input
              ref="name"
              type="text"
              className="input name"
              placeholder="Name"
              defaultValue={this.props.initialName || ''}
              onChange={this.onNameChange.bind(this)}
            />
            {name_error && <div className="name_error_msg">{name_error}</div>}
          </div>

          <div className="input_holder">
            <label>Avatar </label>
            <div className="avatar_picker">
              {this.avatar_opts.map(
                function (opt) {
                  const isSel = avatar == opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={this.selectAvatar.bind(this, opt)}
                      className={'avatar_option' + (isSel ? ' active' : '')}
                    >
                      <span>{opt}</span>
                    </button>
                  );
                }.bind(this),
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          onClick={this.saveName.bind(this)}
          className="button"
        >
          <span>
            START <span className="fa fa-caret-right"></span>
          </span>
        </button>
      </div>
    );
  }

  //	------------------------	------------------------	------------------------

  selectAvatar(avatar) {
    this.setState({ avatar });
  }

  //	------------------------	------------------------	------------------------

  onNameChange() {
    if (this.state.name_error) this.setState({ name_error: '' });
  }

  //	------------------------	------------------------	------------------------

  saveName() {
    const name = this.refs.name.value.trim();
    if (!name) {
      this.setState({ name_error: 'Please enter your name.' });
      return;
    }

    this.props.onSetName(name, this.state.avatar);
  }
}

SetName.propTypes = {
  onSetName: React.PropTypes.func.isRequired,
  initialName: React.PropTypes.string,
  initialAvatar: React.PropTypes.string,
};
