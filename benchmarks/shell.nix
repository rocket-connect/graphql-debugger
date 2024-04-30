{ pkgs ? import <nixpkgs> { } }:
pkgs.mkShell {
  nativeBuildInputs = with pkgs; [
    libyaml
    gmp
    libevent
    pcre
    zlib
    openssl
    rustc
    cargo
    go
    nodejs
    nodePackages.npm
    dotnet-sdk
    jdk
    sbt
    python3Full
    pipenv
    cmake
    elixir
    ruby
    bundler
    psmisc
    nim
    nimble
    bun
    pcre2
    crystal
    shards
    ldc
    dub
  ];

  shellHook = ''
    # workaround https://github.com/sbt/sbt-assembly/issues/496
    export LC_ALL=C.UTF-8
    
    export GEM_HOME="$(ruby -e 'puts Gem.user_dir')"
    export GEM_PATH="$GEM_HOME:$GEM_PATH"
    export PATH="$PATH:$GEM_HOME/bin:$HOME/go/bin:$HOME/.cargo/bin"

    go install github.com/codesenberg/bombardier@latest
    mix local.hex --force
    mix local.rebar --force

    cargo install --git https://github.com/tailcallhq/tailcall
  '';
}
