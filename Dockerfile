FROM eclipse-temurin:17-jre-jammy

ENV MULE_HOME=/opt/mule
ENV PATH=$MULE_HOME/bin:$PATH

# Mule runtime — must be present in mule-runtime/ before running the build script.
# This is the user-supplied vendor download and is left byte-for-byte untouched
# on disk; any customization happens below, to the copy inside the image only.
COPY mule-runtime /opt/mule

# ----------------------------------------------------------------------------
# Memory tuning — see README.md "Memory configuration" for full rationale.
#
# The vendor wrapper.conf hardcodes a 1024MB/1024MB heap with -XX:+AlwaysPreTouch,
# which forces the full 1GB to be committed at startup regardless of load — a
# production-sized default that's overkill for a local single-user playground.
#
# We patch the copy of wrapper.conf inside the image (never the source file in
# mule-runtime/ on disk, so re-extracting a fresh runtime never loses this):
#   - initmemory/maxmemory become %MULE_HEAP_INIT_MB%/%MULE_HEAP_MAX_MB% tokens,
#     which Mule's own Tanuki wrapper resolves from environment variables at
#     container start (the same mechanism it already uses for %MULE_HOME%).
#   - -XX:+AlwaysPreTouch is disabled so heap is committed on demand, not upfront.
#
# The ARGs below only set the image's *default* heap size. To change it without
# rebuilding, override MULE_HEAP_INIT_MB / MULE_HEAP_MAX_MB via `environment:`
# in docker-compose.yml or `docker run -e`. To change the built-in default
# itself, pass `--build-arg` at build time.
ARG MULE_HEAP_INIT_MB=128
ARG MULE_HEAP_MAX_MB=384
ENV MULE_HEAP_INIT_MB=${MULE_HEAP_INIT_MB}
ENV MULE_HEAP_MAX_MB=${MULE_HEAP_MAX_MB}

RUN sed -i \
        -e 's/^wrapper\.java\.initmemory=.*/wrapper.java.initmemory=%MULE_HEAP_INIT_MB%/' \
        -e 's/^wrapper\.java\.maxmemory=.*/wrapper.java.maxmemory=%MULE_HEAP_MAX_MB%/' \
        -e 's/^wrapper\.java\.additional\.9=-XX:+AlwaysPreTouch/#wrapper.java.additional.9=-XX:+AlwaysPreTouch/' \
        /opt/mule/conf/wrapper.conf
# ----------------------------------------------------------------------------

# EE license — place your .lic in license/ before building; leave empty for CE
COPY license /opt/mule/licenses

# Application jar — copied to apps/ by the build script before docker build runs
COPY apps/dw-playground-pro.jar /opt/mule/apps/dw-playground-pro.jar

EXPOSE 8081

ENTRYPOINT ["/opt/mule/bin/mule", "-M-Dmule.env=docker"]
