FROM eclipse-temurin:17-jre

ENV MULE_HOME=/opt/mule
ENV PATH=$MULE_HOME/bin:$PATH

# Mule runtime — must be present in mule-runtime/ before running the build script
COPY mule-runtime /opt/mule

# EE license — place your .lic in license/ before building; leave empty for CE
COPY license /opt/mule/licenses

# Application jar — copied to apps/ by the build script before docker build runs
COPY apps/dw-playground-pro.jar /opt/mule/apps/dw-playground-pro.jar

EXPOSE 8081

ENTRYPOINT ["/opt/mule/bin/mule", "-M-Dmule.env=docker"]
